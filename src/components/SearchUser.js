import { Input, Space, Button, Modal } from 'antd';
import React from 'react';
import { useState } from 'react';
import AddUser from './AddUser';

const { Search } = Input;

const SearchUser = ({ onSearch, onAddSuccess }) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };

  const handleAddSuccess = () => {
    setOpen(false);
    if (onAddSuccess) {
      onAddSuccess();
    }
  };

  // 搜索函数
  const handleSearch = (value) => {
    // 如果搜索内容为空，显示弹窗但依然执行搜索
    if (!value || value.trim() === '') {
      Modal.info({
        title: '提示',
        content: '搜索内容为空，将显示所有用户',
        okText: '确定',
      });
    }
    
    if (onSearch && typeof onSearch === 'function') {
      onSearch(value); // 即使为空也会调用，显示所有用户
    } else {
      console.warn('onSearch prop is not a function or not provided');
    }
  };

  // 输入框变化处理
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <>
      <Space orientation="horizontal" style={{ margin: '16px 0 16px 16px' }}>
        <span style={{ marginRight: '8px', fontSize: '16px' }}>用户名</span>
        <Search
          placeholder="请输入用户名"
          allowClear
          enterButton="查询用户"
          size="large"
          onSearch={handleSearch}
          onChange={handleInputChange}
          value={searchValue}
          style={{ width: 300 }}
        />

        <Button type="primary" onClick={showModal}>
          添加用户
        </Button>
        <Modal
          title="添加用户"
          open={open}
          onCancel={handleCancel}
          footer={null}
        >
          <AddUser onSuccess={handleAddSuccess} 
          onCancel={handleCancel} />
        </Modal>
      </Space>
    </>
  );
};

// 设置默认props
SearchUser.defaultProps = {
  onSearch: () => console.log('onSearch function not provided'),
  onAddSuccess: () => console.log('onAddSuccess function not provided')
};

export default SearchUser;