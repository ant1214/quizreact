import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from './config/apiConfig'; 
const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleFinish = async (values) => {
    setLoading(true);
    try {
      // 修改：调用管理员登录接口
      const response = await axios.post(`${API_BASE_URL}/admin/login`, values);
      const result = response.data;
      
      if (result.code === 1) {
        localStorage.setItem('token', result.data);
        message.success('管理员登录成功');
        onLogin();
        navigate('/Admin', { replace: true });
      } else {
        // 管理员登录失败的具体提示
        if (result.msg === 'invalid account') {
          message.error('非管理员账号，无法登录');
        } else {
          message.error(result.msg || '登录失败');
        }
      }
    } catch (error) {
      console.error('登录错误:', error);
      message.error(error.response?.data?.msg || '网络错误');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 300, margin: '100px auto' }}>
      <h1 style={{ color: 'black' }}>Quiz管理系统登录</h1>
      <Form onFinish={handleFinish}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder="密码" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Login;