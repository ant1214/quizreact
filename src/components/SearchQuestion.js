import { Input, Space, Button, Modal } from 'antd';
import React, { useState } from 'react';
import AddQuestion from './AddQuestion'; // 需要创建这个组件

const { Search } = Input;

const SearchQuestion = ({ onSearch, onAddSuccess }) => {
  const [open, setOpen] = useState(false);

  const handleSearch = (value) => {
    if (onSearch && typeof onSearch === 'function') {
      onSearch(value);
    }
  };

  const handleAddSuccess = () => {
    setOpen(false);
    if (onAddSuccess) onAddSuccess();
  };

  return (
    <Space style={{ margin: '16px 0 16px 16px' }}>
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
        <AddQuestion onSuccess={handleAddSuccess} />
      </Modal>
    </Space>
  );
};

export default SearchQuestion;