import * as yup from 'yup';
import { SubscriptionPeriod } from '../types';

export const subscriptionFormSchema = yup.object().shape({
  name: yup
    .string()
    .required('请输入订阅名称')
    .max(50, '名称长度不能超过50个字符'),
  platform: yup
    .string()
    .required('请输入平台名称'),
  cost: yup
    .number()
    .required('请输入费用')
    .positive('费用必须大于0')
    .max(999999, '费用不能超过999999')
    .test('decimal-places', '费用最多保留两位小数', (value) => {
      if (!value) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  period: yup
    .mixed<SubscriptionPeriod>()
    .required('请选择周期'),
  customDays: yup.number().when('period', (period, schema) => {
    if (Array.isArray(period) && period[0] === 'custom') {
      return schema
        .required('请输入自定义天数')
        .positive('天数必须大于0')
        .max(365, '天数不能超过365天')
        .integer('天数必须为整数');
    }
    return schema.nullable();
  }),
  startDate: yup
    .string()
    .required('请选择开始日期'),
  notes: yup
    .string()
    .max(500, '备注长度不能超过500个字符')
    .nullable(),
});

export type SubscriptionFormData = yup.InferType<typeof subscriptionFormSchema>;