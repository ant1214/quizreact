import { Form, Input, Button, message, Select } from 'antd';
import React, { useState } from 'react';

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
};
const tailFormItemLayout = {
  wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } },
};

const AddUser = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    
    // 模拟网络延迟
    setTimeout(() => {
      console.log('提交的用户数据:', values);
      
      // 演示模式，只显示成功消息
      message.success(`已添加用户：${values.username}（演示模式）`);
      
      // 重置表单
      form.resetFields();
      
      // 通知父组件添加成功
      if (onSuccess) {
        onSuccess();
      }
      
      setLoading(false);
    }, 500); // 500ms 延迟模拟网络请求
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          { required: true, message: '请输入用户名!' },
          { min: 2, message: '用户名至少2个字符!' },
          { max: 20, message: '用户名最多20个字符!' },
          { pattern: /^[a-zA-Z0-9]+$/, message: '用户名只能包含字母和数字!' }
        ]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
        rules={[
          { required: true, message: '请输入密码!' },
          { min: 6, message: '密码至少6个字符!' }
        ]}
        hasFeedback
      >
        <Input.Password placeholder="请输入密码" />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="确认密码"
        dependencies={['password']}
        hasFeedback
        rules={[
          { required: true, message: '请确认密码!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致!'));
            },
          }),
        ]}
      >
        <Input.Password placeholder="请再次输入密码" />
      </Form.Item>

      <Form.Item
        name="role"
        label="用户角色"
        rules={[{ required: true, message: '请选择用户角色!' }]}
      >
        <Select placeholder="选择用户角色">
          <Select.Option value="0">普通用户</Select.Option>
          <Select.Option value="1">管理员</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit" loading={loading}>
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddUser;

// import { Form, Input, Button, message, Select } from 'antd';
// import React, { useState } from 'react';
// import axios from 'axios';

// import { API_BASE_URL, getAuthConfig } from '../config/apiConfig'; 
// const formItemLayout = {
//   labelCol: { xs: { span: 24 }, sm: { span: 8 } },
//   wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
// };
// const tailFormItemLayout = {
//   wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 8 } },
// };

// const AddUser = ({ onSuccess }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);

// const onFinish = async (values) => {
//   setLoading(true);
//   try {
//     const userData = {
//       username: values.username,
//       password: values.password,
//       checkpassword: values.confirm,
//       userrole: values.role || "0"
//     };

//     console.log('发送的数据:', userData);

//     // 获取 token
//     const token = localStorage.getItem('token');
//     const config = token ? { 
//       headers: { token: token}
//     } : {};

//     const response = await axios.post(`${API_BASE_URL}/addUser` , userData, config);
    
//     console.log('后端响应:', response.data);
    
//     if (response.data && response.data.code === 1) {
//       message.success(response.data.msg || '添加用户成功');
//       form.resetFields();
//       onSuccess();
//     } else {
//       message.error(response.data.msg || '添加失败');
//     }
//   } catch (error) {
//     console.error('添加用户失败:', error);
//     if (error.response?.status === 401) {
//       message.error('登录已过期，请重新登录');
//       localStorage.removeItem('token');
//     } else {
//       message.error('添加用户失败: ' + (error.response?.data?.msg || error.message));
//     }
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <Form
//       {...formItemLayout}
//       form={form}
//       name="register"
//       onFinish={onFinish}
//       scrollToFirstError
//     >
//       <Form.Item
//         name="username"
//         label="用户名"
//         rules={[
//           { required: true, message: '请输入用户名!' },
//           { min: 2, message: '用户名至少2个字符!' },
//           { max: 20, message: '用户名最多20个字符!' },
//           { pattern: /^[a-zA-Z0-9]+$/, message: '用户名只能包含字母和数字!' }
//         ]}
//       >
//         <Input placeholder="请输入用户名" />
//       </Form.Item>

//       <Form.Item
//         name="password"
//         label="密码"
//         rules={[
//           { required: true, message: '请输入密码!' },
//           { min: 6, message: '密码至少6个字符!' }
//         ]}
//         hasFeedback
//       >
//         <Input.Password placeholder="请输入密码" />
//       </Form.Item>

//       <Form.Item
//         name="confirm"
//         label="确认密码"
//         dependencies={['password']}
//         hasFeedback
//         rules={[
//           { required: true, message: '请确认密码!' },
//           ({ getFieldValue }) => ({
//             validator(_, value) {
//               if (!value || getFieldValue('password') === value) {
//                 return Promise.resolve();
//               }
//               return Promise.reject(new Error('两次输入的密码不一致!'));
//             },
//           }),
//         ]}
//       >
//         <Input.Password placeholder="请再次输入密码" />
//       </Form.Item>

//       <Form.Item
//         name="role"
//         label="用户角色"
//         rules={[{ required: true, message: '请选择用户角色!' }]}
//       >
//         <Select placeholder="选择用户角色">
//           <Select.Option value="0">普通用户</Select.Option>
//           <Select.Option value="1">管理员</Select.Option>
//         </Select>
//       </Form.Item>

//       <Form.Item {...tailFormItemLayout}>
//         <Button type="primary" htmlType="submit" loading={loading}>
//           提交
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };

// export default AddUser;