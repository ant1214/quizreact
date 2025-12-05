import { Space, Table, message, Modal, Form, Input, Button, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { API_BASE_URL, getAuthConfig } from '../config/apiConfig'; 
const { TextArea } = Input;
const { Option } = Select;

const QuestionTab = ({ searchKeyword, refreshFlag }) => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
        showSizeChanger: false,
        placement: 'bottomLeft',
    });
    const [loading, setLoading] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [form] = Form.useForm();

    // 获取认证配置
    const getAuthConfig = () => {
        const token = localStorage.getItem('token');
        return token ? { headers: { token: token } } : {};
    };

    // 定义表格列
    const columns = [
        {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            width: 50,
        },
        {
            title: '题目',
            dataIndex: 'question',
            key: 'question',
            render: (text) => <div style={{ maxWidth: 300 }}>{text || '无题目'}</div>,
            width: 100,
        },
        {
            title: '选项',
            key: 'options',
            render: (_, record) => {
                return (
                    <div style={{ maxWidth: 200 }}>
                        {record.optiona && <div>A. {record.optiona}</div>}
                        {record.optionb && <div>B. {record.optionb}</div>}
                        {record.optionc && <div>C. {record.optionc}</div>}
                        {record.optiond && <div>D. {record.optiond}</div>}
                        {!record.optiona && !record.optionb && !record.optionc && !record.optiond && 
                            <div>无选项</div>
                        }
                    </div>
                );
            },
            width: 100,
        },
        {
            title: '答案',
            dataIndex: 'answerLetter',
            key: 'answerLetter',
            width: 80,
            render: (text) => <strong>{text || '无答案'}</strong>,
            width: 50,
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

    // 获取数据
    const fetchData = (page = 1, pageSize = 5, keyword = '') => {
        setLoading(true);
        let url = `${API_BASE_URL}/questions`;
        let params = { page, pageSize };
        
        // 如果有搜索关键词，使用搜索接口
        if (keyword && keyword.trim() !== '') {
            url = `${API_BASE_URL}findQuestion`;
            params = { 
                keyword,
                page,
                pageSize
            };
        }

        console.log('请求URL:', url, '参数:', params);

        axios
            .get(url, { params, ...getAuthConfig() })
            .then((response) => {
                const res = response.data;
                console.log('完整接口响应:', res);
                
                if (res.code === 1) {
                    const responseData = res.data;
                    console.log('responseData:', responseData);
                    
                    // 获取数据列表
                    let rows = [];
                    let total = 0;
                    
                    if (responseData) {
                        // 获取分页数据（qsBeanList）
                        if (responseData.qsBeanList) {
                            rows = responseData.qsBeanList || [];
                            total = responseData.total || 0;
                        }
                        // 获取搜索数据（可能也是数组）
                        else if (Array.isArray(responseData)) {
                            rows = responseData;
                            total = responseData.length;
                        }
                    }
                    
                    console.log('原始数据 rows:', rows);
                    
                    // 将后端 QSBeanOutManage 格式转换为前端需要的格式
                    const formattedData = rows.map((item, index) => {
                        // 后端返回的 item 是 QSBeanOutManage 对象
                        // 包含: id, questionText, options, answer
                        
                        const options = item.options || [];
                        
                        // 根据正确答案文本找到对应的字母
                        let answerLetter = '';
                        const answerText = item.answer || '';
                        
                        if (options[0] === answerText) answerLetter = 'A';
                        else if (options[1] === answerText) answerLetter = 'B';
                        else if (options[2] === answerText) answerLetter = 'C';
                        else if (options[3] === answerText) answerLetter = 'D';
                        
                        return {
                            key: item.id || index,
                            id: item.id,
                            question: item.questionText, // 注意这里是 questionText
                            optiona: options[0] || '',
                            optionb: options[1] || '',
                            optionc: options[2] || '',
                            optiond: options[3] || '',
                            answerText: answerText, // 保存原始答案文本
                            answerLetter: answerLetter, // 转换后的字母答案
                        };
                    });
                    
                    console.log('格式化后的数据 formattedData:', formattedData);
                    
                    setData(formattedData);
                    setPagination((prev) => ({
                        ...prev,
                        current: page,
                        pageSize: pageSize,
                        total: total,
                    }));
                    
                } else if (res.code === 0) {
                    // 检查是否认证失败
                    if (res.msg && (res.msg.includes("token") || res.msg.includes("认证"))) {
                        message.error('登录已过期，请重新登录');
                        localStorage.removeItem('token');
                    } else {
                        message.error(res.msg || '获取题目数据失败');
                    }
                    setData([]);
                } else {
                    message.error(res.msg || '获取题目数据失败');
                    setData([]);
                }
                
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
                
                if (error.response?.status === 401) {
                    message.error('未授权，请重新登录');
                    localStorage.removeItem('token');
                } else {
                    message.error('获取题目数据失败: ' + error.message);
                }
                setData([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // 编辑题目
    const handleEdit = (record) => {
        console.log('编辑题目:', record);
        setEditingQuestion(record);
        form.setFieldsValue({
            question: record.question,
            optionA: record.optiona,
            optionB: record.optionb,
            optionC: record.optionc,
            optionD: record.optiond,
            answer: record.answerLetter // 使用字母答案
        });
        setEditModalVisible(true);
    };

    // 保存编辑
    const handleEditSave = async () => {
        try {
            const values = await form.validateFields();
            console.log('编辑表单值:', values);
            
            // 构建更新数据，注意字段名与后端 QSBean 一致
            const questionData = {
                id: editingQuestion.id,
                question: values.question,
                optiona: values.optionA || '',
                optionb: values.optionB || '',
                optionc: values.optionC || '',
                optiond: values.optionD || '',
                answer: values.answer.toLowerCase() // 后端期望小写字母
            };

            console.log('发送更新数据:', questionData);

            const response = await axios.post(
                `${API_BASE_URL}/updateQuestion`,
                questionData,
                getAuthConfig()
            );
            
            console.log('更新响应:', response.data);
            
            if (response.data.code === 1) {
                message.success(response.data.msg || '更新题目成功');
                setEditModalVisible(false);
                fetchData(pagination.current, pagination.pageSize, searchKeyword);
            } else {
                message.error(response.data.msg || '更新失败');
            }
        } catch (error) {
            console.error('更新题目失败:', error);
            if (error.response?.status === 401) {
                message.error('登录已过期，请重新登录');
                localStorage.removeItem('token');
            } else {
                message.error('更新题目失败: ' + error.message);
            }
        }
    };

    // 删除题目
    const handleDelete = (record) => {
        Modal.confirm({
            title: '确认删除',
            content: `确定要删除题目 "${record.question ? record.question.substring(0, 50) : '无标题'}${record.question && record.question.length > 50 ? '...' : ''}" 吗？`,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                axios
                    .get(`${API_BASE_URL}/delQuestion`, { 
                        params: { id: record.id },
                        ...getAuthConfig()
                    })
                    .then((response) => {
                        console.log('删除响应:', response.data);
                        if (response.data.code === 1) {
                            message.success(response.data.msg || '删除成功');
                            fetchData(pagination.current, pagination.pageSize, searchKeyword);
                        } else {
                            message.error(response.data.msg || '删除失败');
                        }
                    })
                    .catch((error) => {
                        console.error("Error deleting question:", error);
                        if (error.response?.status === 401) {
                            message.error('登录已过期，请重新登录');
                            localStorage.removeItem('token');
                        } else {
                            message.error('删除失败: ' + error.message);
                        }
                    });
            }
        });
    };

    // 页码变化时的回调
    const handleTableChange = (pag) => {
        console.log('页码变化:', pag);
        fetchData(pag.current, pag.pageSize, searchKeyword);
    };

    // 初始加载
    useEffect(() => {
        console.log('初始加载数据');
        fetchData(1, 5, searchKeyword);
    }, []);

    // 监听搜索关键词和刷新标志
    useEffect(() => {
        console.log('搜索关键词变化或刷新:', searchKeyword, refreshFlag);
        // 搜索时重置到第一页
        fetchData(1, pagination.pageSize, searchKeyword);
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
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: pagination.showSizeChanger,
                    placement: pagination.placement,
                }}
                loading={loading}
                onChange={handleTableChange}
                rowKey="id"
                bordered
                size="middle"
                scroll={{ x: 'max-content' }}
                locale={{ emptyText: '暂无数据' }}
            />

            {/* 编辑题目模态框 */}
            <Modal
                title="编辑题目"
                open={editModalVisible}
                onOk={handleEditSave}
                onCancel={() => setEditModalVisible(false)}
                okText="保存"
                cancelText="取消"
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="question"
                        label="题目内容"
                        rules={[{ required: true, message: '请输入题目内容' }]}
                    >
                        <TextArea rows={3} placeholder="请输入题目内容" />
                    </Form.Item>

                    <Space style={{ width: '100%' }} wrap>
                        <Form.Item
                            name="optionA"
                            label="选项A"
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="选项A" />
                        </Form.Item>
                        
                        <Form.Item
                            name="optionB"
                            label="选项B"
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="选项B" />
                        </Form.Item>
                        
                        <Form.Item
                            name="optionC"
                            label="选项C"
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="选项C" />
                        </Form.Item>
                        
                        <Form.Item
                            name="optionD"
                            label="选项D"
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="选项D" />
                        </Form.Item>
                    </Space>

                    <Form.Item
                        name="answer"
                        label="正确答案"
                        rules={[{ required: true, message: '请选择正确答案' }]}
                    >
                        <Select placeholder="选择正确答案">
                            <Option value="A">A</Option>
                            <Option value="B">B</Option>
                            <Option value="C">C</Option>
                            <Option value="D">D</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default QuestionTab;