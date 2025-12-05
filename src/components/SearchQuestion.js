import { Input, Space, Button, Modal } from 'antd';
import React, { useState } from 'react';
import AddQuestion from './AddQuestion';

const { Search } = Input;

const SearchQuestion = ({ onSearch, onAddSuccess }) => {
  const [open, setOpen] = useState(false);

  const handleSearch = (value) => {
    // 如果搜索内容为空，显示弹窗但依然执行搜索
    if (!value || value.trim() === '') {
      Modal.info({
        title: '提示',
        content: '搜索内容为空，将显示所有题目',
        okText: '确定',
      });
    }
    
    if (onSearch && typeof onSearch === 'function') {
      onSearch(value); // 即使为空也会调用，显示所有题目
    }
  };

  const handleAddSuccess = () => {
    setOpen(false);
    if (onAddSuccess) onAddSuccess();
  };

  return (
    <Space style={{ margin: '16px 0 16px 16px' }}>
      <span style={{ marginRight: '8px', fontSize: '16px' }}>题目</span>
      <Search
        placeholder="请输入关键词"
        allowClear
        enterButton="查询题目"
        size="large"
        onSearch={handleSearch}
        style={{ width: 300 }}
      />
      
      <Button 
        type="primary" 
        onClick={() => setOpen(true)}
      >
        添加题目
      </Button>
      
      <Modal
        title="添加题目"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={600}
      >
        <AddQuestion onSuccess={handleAddSuccess} 
        onCancel={() => setOpen(false)}/>
      </Modal>
    </Space>
  );
};

export default SearchQuestion;