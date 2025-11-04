import React from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, Button, Row, Col } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { addSubscription, updateSubscription } from '../../store/subscriptionSlice';
import { subscriptionFormSchema } from '../../utils/validation';
import { calculateNextBillingDate, calculateSubscriptionStatus } from '../../utils/subscription';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';

const { TextArea } = Input;
const { Option } = Select;

interface SubscriptionFormProps {
  visible: boolean;
  onCancel: () => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ visible, onCancel }) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.subscriptions);
  const { editingSubscription } = useAppSelector(state => state.ui);
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (editingSubscription) {
      form.setFieldsValue({
        ...editingSubscription,
        startDate: dayjs(editingSubscription.startDate),
      });
    } else {
      form.resetFields();
    }
  }, [editingSubscription, form]);

  const handleSubmit = async (values: any) => {
    try {
      const validatedValues = await subscriptionFormSchema.validate(values, { abortEarly: false });
      const { period, customDays, startDate, notes } = validatedValues;

      const subscriptionData = {
        ...validatedValues,
        notes: notes ?? undefined,
      };

      const nextBillingDate = calculateNextBillingDate(startDate, period, customDays);
      const status = calculateSubscriptionStatus(nextBillingDate);

      if (editingSubscription) {
        dispatch(updateSubscription({
          ...editingSubscription,
          ...subscriptionData,
          nextBillingDate,
          status,
          updatedAt: new Date().toISOString(),
        }));
      } else {
        dispatch(addSubscription({
          id: uuidv4(),
          ...subscriptionData,
          nextBillingDate,
          status,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
      }

      onCancel();
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const yupErrors = error.inner.map(err => ({
          name: err.path!,
          errors: err.errors,
        }));
        form.setFields(yupErrors);
      }
    }
  };

  return (
    <Modal
      open={visible}
      title={editingSubscription ? '编辑订阅' : '新增订阅'}
      okText={editingSubscription ? '更新' : '创建'}
      cancelText="取消"
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          period: 'monthly',
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="订阅名称"
              rules={[{ required: true, message: '请输入订阅名称' }]}
            >
              <Input placeholder="请输入订阅名称" maxLength={50} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="platform"
              label="平台"
              rules={[{ required: true, message: '请输入平台名称' }]}
            >
              <Input placeholder="请输入平台名称" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="cost"
              label="费用"
              rules={[{ required: true, message: '请输入费用' }]}
            >
              <InputNumber
                placeholder="请输入费用"
                style={{ width: '100%' }}
                min={0.01}
                max={999999}
                step={0.01}
                precision={2}
                addonBefore="¥"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="period"
              label="周期"
              rules={[{ required: true, message: '请选择周期' }]}
            >
              <Select placeholder="请选择周期">
                <Option value="daily">日</Option>
                <Option value="weekly">周</Option>
                <Option value="monthly">月</Option>
                <Option value="quarterly">季</Option>
                <Option value="yearly">年</Option>
                <Option value="custom">自定义</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.period !== currentValues.period}
        >
          {({ getFieldValue }) =>
            getFieldValue('period') === 'custom' ? (
              <Form.Item
                name="customDays"
                label="自定义天数"
                rules={[{ required: true, message: '请输入自定义天数' }]}
              >
                <InputNumber
                  placeholder="请输入天数"
                  style={{ width: '100%' }}
                  min={1}
                  max={365}
                  step={1}
                  precision={0}
                  addonAfter="天"
                />
              </Form.Item>
            ) : null
          }
        </Form.Item>

        <Form.Item
          name="startDate"
          label="开始日期"
          rules={[{ required: true, message: '请选择开始日期' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            placeholder="请选择开始日期"
            format="YYYY-MM-DD"
          />
        </Form.Item>

        <Form.Item
          name="notes"
          label="备注"
        >
          <TextArea
            placeholder="请输入备注信息（可选）"
            rows={3}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button onClick={onCancel}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingSubscription ? '更新' : '保存'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubscriptionForm;