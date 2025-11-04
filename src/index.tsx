import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { store } from './store';
import App from './App';
import './index.css';

const theme = {
  token: {
    colorPrimary: '#3B82F6',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    colorInfo: '#3B82F6',
    colorTextBase: '#1F2937',
    colorBgBase: '#F9FAFB',
    borderRadius: 8,
    wireframe: false,
  },
  components: {
    Card: {
      borderRadiusLG: 8,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    Button: {
      borderRadius: 6,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    },
    Table: {
      borderRadius: 8,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    Modal: {
      borderRadiusLG: 8,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    },
    Input: {
      borderRadius: 6,
    },
    Select: {
      borderRadius: 6,
    },
    DatePicker: {
      borderRadius: 6,
    },
  },
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={zhCN} theme={theme}>
        <App />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);