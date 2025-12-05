import { UploadOutlined, UserOutlined, VideoCameraOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchUser from './components/SearchUser';
import UserTab from './components/UserTab';
import SearchQuestion from './components/SearchQuestion';
import QuestionTab from './components/QuestionTab';
import Login from './Login';

const { Header, Footer, Sider, Content } = Layout;

const App = () => {
  const [selectedKey, setSelectedKey] = useState('1');
  const [userSearchKeyword, setUserSearchKeyword] = useState('');
  const [userRefreshFlag, setUserRefreshFlag] = useState(0);
  const [questionSearchKeyword, setQuestionSearchKeyword] = useState('');
  const [questionRefreshFlag, setQuestionRefreshFlag] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const navigate = useNavigate();

  // 检查登录状态的effect
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      // 如果未登录，重定向到登录页
      navigate('/login');
    }
  }, [navigate]);

  // 用户搜索处理函数
  const handleUserSearch = (keyword) => {
    console.log('用户搜索:', keyword);
    setUserSearchKeyword(keyword);
  };

  // 用户添加成功处理函数
  const handleUserAddSuccess = () => {
    console.log('用户添加成功，刷新用户列表');
    setUserRefreshFlag(prev => prev + 1);
  };

  // 题目搜索处理函数
  const handleQuestionSearch = (keyword) => {
    console.log('题目搜索:', keyword);
    setQuestionSearchKeyword(keyword);
  };

  // 题目添加成功处理函数
  const handleQuestionAddSuccess = () => {
    console.log('题目添加成功，刷新题目列表');
    setQuestionRefreshFlag(prev => prev + 1);
  };

  // 处理登录成功
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate('/');
  };

  // 退出登录函数
  const handleLogout = () => {
    // 清除token
    localStorage.removeItem('token');
    // 更新登录状态
    setIsLoggedIn(false);
    // 显示退出成功消息
    message.success('已退出登录');
    // 重定向到登录页
    navigate('/login');
  };

  // 如果未登录，显示登录页面
  if (!isLoggedIn) {
    return <Login onLogin={handleLoginSuccess} />;
  }

  return (
    <Layout>
      <Header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: '#001529'
      }}>
        <h1 style={{color:'#ffffff', margin: 0}}>Quiz管理系统</h1>
        <Button 
          type="primary" 
          danger 
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          退出登录
        </Button>
      </Header>
      <Layout>
        <Sider>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            onClick={({ key }) => setSelectedKey(key)}
            items={[
              { key: '1', icon: <UserOutlined />, label: '用户管理' },
              { key: '2', icon: <VideoCameraOutlined />, label: '题目管理' }
            ]}
          />
        </Sider>
        <Content style={{ padding: '20px', minHeight: 'calc(100vh - 134px)' }}>
          {selectedKey === '1' && (
            <>
              <SearchUser 
                onSearch={handleUserSearch}
                onAddSuccess={handleUserAddSuccess}
              />
              <UserTab 
                searchKeyword={userSearchKeyword}
                refreshFlag={userRefreshFlag}
              />
            </>
          )}
          {selectedKey === '2' && (
            <>
              <SearchQuestion 
                onSearch={handleQuestionSearch}
                onAddSuccess={handleQuestionAddSuccess}
              />
              <QuestionTab 
                searchKeyword={questionSearchKeyword}
                refreshFlag={questionRefreshFlag}
              />
            </>
          )}
        </Content>
      </Layout>
      <Footer style={{ textAlign: 'center' }}>
        Quiz管理系统 ©2025 Created by tfzhang
      </Footer>
    </Layout>
  );
};

export default App;