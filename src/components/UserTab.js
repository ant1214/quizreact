import { Space, Table, message, Modal, Form, Input, Button } from 'antd';
import React, { useState, useEffect } from 'react';

// 虚拟用户数据
const mockUserData = [
    { key: '1', id: '1', userName: 'John Brown', date: '2025-01-01' },
    { key: '2', id: '2', userName: 'Jim Green', date: '2025-01-02' },
    { key: '3', id: '3', userName: 'Joe Black', date: '2025-01-03' },
    { key: '4', id: '4', userName: 'Alice White', date: '2025-01-04' },
    { key: '5', id: '5', userName: 'Bob Smith', date: '2025-01-05' },
    { key: '6', id: '6', userName: 'Charlie Davis', date: '2025-01-06' },
    { key: '7', id: '7', userName: 'David Wilson', date: '2025-01-07' },
    { key: '8', id: '8', userName: 'Emma Johnson', date: '2025-01-08' },
    { key: '9', id: '9', userName: 'Frank Miller', date: '2025-01-09' },
    { key: '10', id: '10', userName: 'Grace Lee', date: '2025-01-10' },
];

const UserTable = ({ searchKeyword, refreshFlag }) => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: mockUserData.length,
        showSizeChanger: false,
        placement: 'bottomLeft',
    });
    const [loading, setLoading] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();

    // 定义表格列
    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: '用户名',
            dataIndex: 'userName',
            key: 'userName',
            render: (text) => <a>{text}</a>,
            width: 180,
        },
        {
            title: '日期',
            dataIndex: 'date',
            key: 'date',
            width: 150,
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
                    <Button type="link" danger onClick={() => handleDelete(record)}>删除</Button>
                </Space>
            ),
        },
    ];

    // 模拟获取数据
    const fetchData = (page = 1, pageSize = 5, keyword = '') => {
        setLoading(true);
        
        // 模拟网络延迟
        setTimeout(() => {
            let filteredData = [...mockUserData];
            
            // 如果有搜索关键词，进行过滤
            if (keyword && keyword.trim() !== '') {
                filteredData = mockUserData.filter(user => 
                    user.userName.toLowerCase().includes(keyword.toLowerCase())
                );
            }
            
            // 计算分页数据
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const paginatedData = filteredData.slice(start, end);
            
            setData(paginatedData);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: filteredData.length,
                showSizeChanger: false,
                placement: 'bottomLeft',
            });
            setLoading(false);
        }, 300); // 300ms 延迟模拟网络请求
    };

    // 编辑用户
    const handleEdit = (record) => {
        setEditingUser(record);
        form.setFieldsValue({
            username: record.userName,
            password: '',
            confirm: ''
        });
        setEditModalVisible(true);
    };

    // 保存编辑
    const handleEditSave = async () => {
        try {
            const values = await form.validateFields();
            
            // 演示模式，只显示消息
            message.success(`已更新用户信息：${values.username}`);
            setEditModalVisible(false);
            
            // 刷新数据
            fetchData(pagination.current, pagination.pageSize, searchKeyword);
        } catch (error) {
            console.error('表单验证失败:', error);
        }
    };

    // 删除用户 - 只显示弹窗，不实际删除
    const handleDelete = (record) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除用户 "${record.userName}" 吗？（演示模式，不会实际删除）`,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                // 演示模式，只显示消息
                message.success(`已删除用户：${record.userName}（演示模式）`);
            }
        });
    };

    // 页码变化时的回调
    const handleTableChange = (pag) => {
        fetchData(pag.current, pag.pageSize, searchKeyword);
    };

    // 监听搜索关键词和刷新标志
    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize, searchKeyword);
    }, [searchKeyword, refreshFlag]);

    return (
        <>
            <style>{`
                .ant-pagination-item {
                    margin-right: 3px !important;
                    margin-left: 3px !important;
                }
                .ant-pagination-prev,
                .ant-pagination-next {
                    margin-right: 3px !important;
                    margin-left: 3px !important;
                }
                .ant-table-wrapper .ant-table-pagination.ant-pagination {
                    justify-content: flex-start !important;
                }
            `}</style>
            
            <Table
                columns={columns}
                dataSource={data}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                rowKey="id"
                bordered
                size="middle"
            />

            {/* 编辑用户模态框 */}
            <Modal
                title="编辑用户"
                open={editModalVisible}
                onOk={handleEditSave}
                onCancel={() => setEditModalVisible(false)}
                okText="保存"
                cancelText="取消"
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[
                            { required: true, message: '请输入用户名!' },
                            { min: 2, message: '用户名至少2个字符!' },
                            { max: 20, message: '用户名最多20个字符!' },
                        ]}
                    >
                        <Input placeholder="请输入用户名" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="新密码"
                        rules={[
                            { min: 6, message: '密码至少6个字符!' }
                        ]}
                    >
                        <Input.Password placeholder="留空表示不修改密码" />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="确认密码"
                        dependencies={['password']}
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || !getFieldValue('password') || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入的密码不一致!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="确认新密码" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UserTable;


// import { Space, Table, message, Modal, Form, Input, Button } from 'antd';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// import { API_BASE_URL, getAuthConfig } from '../config/apiConfig'; 
// const UserTable = ({ searchKeyword, refreshFlag }) => {
//     const [data, setData] = useState([]);
//     const [pagination, setPagination] = useState({
//         current: 1,
//         pageSize: 5,
//         total: 0,
//         showSizeChanger: false,
//         placement: 'bottomLeft', // 修复：position -> placement
//     });
//     const [loading, setLoading] = useState(false);
//     const [editModalVisible, setEditModalVisible] = useState(false);
//     const [editingUser, setEditingUser] = useState(null);
//     const [form] = Form.useForm();

//     // 获取认证配置
//     const getAuthConfig = () => {
//         const token = localStorage.getItem('token');
//         return token ? { headers: { token: token } } : {};
//     };

//     // 定义表格列
//     const columns = [
//         {
//             title: '序号',
//             dataIndex: 'id',
//             key: 'id',
//             width: 80,
//         },
//         {
//             title: '用户名',
//             dataIndex: 'userName',
//             key: 'userName',
//             render: (text) => <a>{text}</a>,
//             width: 180,
//         },
//         {
//             title: '角色',
//             dataIndex: 'userRole',
//             key: 'userRole',
//             width: 100,
//             render: (role) => role === 1 ? '管理员' : '普通用户',
//         },
//         {
//             title: '日期',
//             dataIndex: 'updateTime',
//             key: 'updateTime',
//             render: (text) => text ? new Date(text).toLocaleString() : '-',
//             width: 180,
//         },
//         {
//             title: '操作',
//             key: 'action',
//             width: 150,
//             render: (_, record) => (
//                 <Space size="middle">
//                     <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
//                     <Button type="link" danger onClick={() => handleDelete(record)}>删除</Button>
//                 </Space>
//             ),
//         },
//     ];

//     // 获取数据
//     const fetchData = (page = 1, pageSize = 5, keyword = '') => {
//         setLoading(true);
//         let url = `${API_BASE_URL}/users`;
//         let params = { page, pageSize };
        
//         // 如果有搜索关键词，使用搜索接口
//         if (keyword && keyword.trim() !== '') {
//             url = `${API_BASE_URL}/findUser`;
//             params = { keyword };
//         }

//         axios
//             .get(url, { params, ...getAuthConfig() })
//             .then((response) => {
//                 const res = response.data;
                
//                 // 检查响应是否成功
//                 if (res.code === 1) {
//                     let rows = [];
//                     let total = 0;
                    
//                     // 数据在 res.data 中
//                     const responseData = res.data;
                    
//                     if (responseData && Array.isArray(responseData.rows)) {
//                         // 分页接口格式
//                         rows = responseData.rows;
//                         total = responseData.total || 0;
//                     } else if (responseData && Array.isArray(responseData)) {
//                         // 搜索接口格式
//                         rows = responseData;
//                         total = rows.length;
//                     } else if (Array.isArray(res)) {
//                         // 直接返回数组
//                         rows = res;
//                         total = res.length;
//                     }
                    
//                     // 格式化数据
//                     const formattedData = rows.map((item) => ({
//                         key: item.id || item.userId,
//                         id: item.id,
//                         userName: item.userName || item.username,
//                         userRole: item.userRole,
//                         updateTime: item.updateTime || item.createTime,
//                     }));
                    
//                     setData(formattedData);
//                     setPagination((prev) => ({
//                         ...prev,
//                         current: page,
//                         pageSize: pageSize,
//                         total: total,
//                     }));
                    
//                 } else if (res.code === 0 && res.msg && (res.msg.includes("token") || res.msg.includes("认证"))) {
//                     // Token 过期或无效
//                     message.error('登录已过期，请重新登录');
//                     localStorage.removeItem('token');
//                     setData([]);
//                 } else {
//                     message.error(res.msg || '获取数据失败');
//                     setData([]);
//                 }
                
//             })
//             .catch((error) => {
//                 console.error("Error fetching users:", error);
                
//                 if (error.response) {
//                     if (error.response.status === 401) {
//                         message.error('未授权，请重新登录');
//                         localStorage.removeItem('token');
//                     } else if (error.response.status === 403) {
//                         message.error('权限不足');
//                     } else {
//                         message.error('获取用户数据失败');
//                     }
//                 } else {
//                     message.error('网络错误，请检查连接');
//                 }
//                 setData([]);
//             })
//             .finally(() => {
//                 setLoading(false);
//             });
//     };

//     // 编辑用户
//     const handleEdit = (record) => {
//         setEditingUser(record);
//         form.setFieldsValue({
//             username: record.userName,
//             password: '',
//             confirm: ''
//         });
//         setEditModalVisible(true);
//     };

//     // 保存编辑
//     const handleEditSave = async () => {
//         try {
//             const values = await form.validateFields();
            
//             const userData = {
//                 id: editingUser.id,
//                 username: values.username,
//                 password: values.password,
//                 checkpassword: values.confirm
//             };

//             const response = await axios.post(`${API_BASE_URL}/updateUser`, userData, getAuthConfig());
            
//             if (response.data.code === 1) {
//                 message.success(response.data.msg || '更新用户成功');
//                 setEditModalVisible(false);
//                 fetchData(pagination.current, pagination.pageSize, searchKeyword);
//             } else {
//                 message.error(response.data.msg || '更新失败');
//             }
//         } catch (error) {
//             console.error('更新用户失败:', error);
//             if (error.response?.status === 401) {
//                 message.error('登录已过期，请重新登录');
//                 localStorage.removeItem('token');
//             } else {
//                 message.error('更新用户失败');
//             }
//         }
//     };

//     // 删除用户
//     const handleDelete = (record) => {
//         Modal.confirm({
//             title: '确认删除',
//             content: `确定要删除用户 "${record.userName}" 吗？`,
//             okText: '确定',
//             cancelText: '取消',
//             onOk: () => {
//                 axios
//                     .get(`${API_BASE_URL}/deleteById`, { 
//                         params: { id: record.id },
//                         ...getAuthConfig()
//                     })
//                     .then((response) => {
//                         console.log('删除响应:', response.data);
//                         if (response.data.code === 1) {
//                             message.success(response.data.msg || '删除成功');
//                             fetchData(pagination.current, pagination.pageSize, searchKeyword);
//                         } else {
//                             message.error(response.data.msg || '删除失败');
//                         }
//                     })
//                     .catch((error) => {
//                         console.error("Error deleting user:", error);
//                         if (error.response?.status === 401) {
//                             message.error('登录已过期，请重新登录');
//                             localStorage.removeItem('token');
//                         } else {
//                             message.error('删除失败');
//                         }
//                     });
//             }
//         });
//     };

//     // 页码变化时的回调
//     const handleTableChange = (pag) => {
//         fetchData(pag.current, pag.pageSize, searchKeyword);
//     };

//     // 监听搜索关键词和刷新标志
//     useEffect(() => {
//         fetchData(pagination.current, pagination.pageSize, searchKeyword);
//     }, [searchKeyword, refreshFlag]);

//     return (
//         <>
//             <style>{`
//                 .ant-pagination-item {
//                     margin-right: 3px !important;
//                     margin-left: 3px !important;
//                 }
//                 .ant-pagination-prev,
//                 .ant-pagination-next {
//                     margin-right: 3px !important;
//                     margin-left: 3px !important;
//                 }
//                 .ant-table-wrapper .ant-table-pagination.ant-pagination {
//                 justify-content: flex-start !important;
//             }
//             `}</style>
            
//             <Table
//                 columns={columns}
//                 dataSource={data}
//                 pagination={{
//                     current: pagination.current,
//                     pageSize: pagination.pageSize,
//                     total: pagination.total,
//                     showSizeChanger: pagination.showSizeChanger,
//                     placement: pagination.placement, // 使用 placement
//                 }}
//                 loading={loading}
//                 onChange={handleTableChange}
//                 rowKey="id"
//                 bordered
//                 size="middle"
//             />

//             {/* 编辑用户模态框 */}
//             <Modal
//                 title="编辑用户"
//                 open={editModalVisible}
//                 onOk={handleEditSave}
//                 onCancel={() => setEditModalVisible(false)}
//                 okText="保存"
//                 cancelText="取消"
//             >
//                 <Form
//                     form={form}
//                     layout="vertical"
//                 >
//                     <Form.Item
//                         name="username"
//                         label="用户名"
//                         rules={[
//                             { required: true, message: '请输入用户名!' },
//                             { min: 2, message: '用户名至少2个字符!' },
//                             { max: 20, message: '用户名最多20个字符!' },
//                             { pattern: /^[a-zA-Z0-9]+$/, message: '用户名只能包含字母和数字!' }
//                         ]}
//                     >
//                         <Input placeholder="请输入用户名" />
//                     </Form.Item>

//                     <Form.Item
//                         name="password"
//                         label="新密码"
//                         rules={[
//                             { min: 6, message: '密码至少6个字符!' }
//                         ]}
//                     >
//                         <Input.Password placeholder="留空表示不修改密码" />
//                     </Form.Item>

//                     <Form.Item
//                         name="confirm"
//                         label="确认密码"
//                         dependencies={['password']}
//                         rules={[
//                             ({ getFieldValue }) => ({
//                                 validator(_, value) {
//                                     if (!value || !getFieldValue('password') || getFieldValue('password') === value) {
//                                         return Promise.resolve();
//                                     }
//                                     return Promise.reject(new Error('两次输入的密码不一致!'));
//                                 },
//                             }),
//                         ]}
//                     >
//                         <Input.Password placeholder="确认新密码" />
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </>
//     );
// };

// export default UserTable;