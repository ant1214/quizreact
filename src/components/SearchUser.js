import { AudioOutlined } from '@ant-design/icons';
import { Input, Space, Button } from 'antd';
import React from 'react';
import { useState } from 'react';
import { Modal } from 'antd';
import AddUser from './AddUser';

const { Search } = Input;

const SearchUser = ({ onSearch, onAddSuccess }) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(''); // 添加状态保存输入值

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
      onAddSuccess(); // 通知父组件刷新数据
    }
  };

  // 搜索函数
  const handleSearch = (value) => {
    if (onSearch && typeof onSearch === 'function') {
      onSearch(value);
    } else {
      console.warn('onSearch prop is not a function or not provided');
    }
  };

  // 输入框变化处理
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  // 按钮点击搜索
  const handleButtonSearch = () => {
    handleSearch(searchValue);
  };

  return (
    <>
      <Space orientation="horizontal" style={{ margin: '16px 0 16px 16px' }}> {/* 修复警告 */}
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
          footer={null} // 移除默认按钮
        >
          <AddUser onSuccess={handleAddSuccess} />
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