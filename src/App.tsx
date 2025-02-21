import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import './App.css'
import Greeting from './components/Greeting'
import ContactForm from './components/ContactForm'
import ProductList from './components/ProductList'
import UserProfile from './components/UserProfile'
import UserCard from './components/UserCard'
import UserList from './components/UserList'
import StatusButton from './components/StatusButton';
import CounterDemo from './components/CounterDemo';
import CustomHookDemo from './components/CustomHookDemo'
import localforage from 'localforage';

type User = {
  id: number;
  name: string;
  email: string;
};


function App() {
  // countという状態を作成。初期値は0
  const [count, setCount] = useState(0)
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // ボタンの状態を管理
  const [buttonStatus, setButtonStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // ユーザーリストを取得
        const storedUsers = await localforage.getItem<User[]>('users');
        const storedUserForm = await localforage.getItem<User>('user'); // フォームで保存されたユーザー
        let combinedUsers = storedUsers || []; // 初期値は空リスト

        // フォームで保存されたユーザーをリストに追加
        if (storedUserForm && !combinedUsers.some((user) => user.email === storedUserForm.email)) {
          combinedUsers = [...combinedUsers, storedUserForm];
        }

        setUsers(combinedUsers);

        // 更新されたユーザーリストをローカルストレージに保存
        await localforage.setItem('users', combinedUsers);

        console.log('Fetched and combined users:', combinedUsers);
      } catch (error) {
        console.error('Error fetching users from localforage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const dummyUser = {
    id: 1,
    name: '山田太郎',
    email: 'taro@example.com',
    age: 25,
  };

  // 編集ボタンがクリックされたときの動作
  const handleEdit = (id: number) => {
    alert(`ユーザーID ${id} を編集します`);
  };

  // ボタンをクリックしたときの動作
  const handleIncrement = () => {
    setCount(count + 1)
  }

  const handleButtonClick = async () => {
    setButtonStatus('success');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setButtonStatus('success');
  };

  return (
    <Router>
      <Routes>
        {/* ホームページ */}
        <Route
          path="/"
          element={
            <div className="app">
              <h1>はじめてのReactコンポーネント</h1>
              <Greeting name="山田" />
              <div className="counter">
                <p>現在のカウント: {count}</p>
                <button onClick={handleIncrement}>+1 増やす</button>
              </div>
              <Link to="/contact">
                <button>問い合わせフォーム</button>
              </Link>
              <Link to="/productList">
                <button>商品リスト</button>
              </Link>
              <Link to="/userprofile">
                <button>ユーザープロフィール</button>
              </Link>
              <Link to="/usercard">
                <button>ユーザープロフィールカード</button>
              </Link>
              <Link to="/userList">
                <button>ユーザーリスト</button>
              </Link>
              <Link to="/status_btn">
                <button>ステータスボタン</button>
              </Link>
              <Link to="/counter-demo">
                <button>カウンターデモ</button>
              </Link>
              <Link to="/custom-hook-demo">
                <button>カスタムフックデモ</button>
              </Link>
            </div>
          }
        />
        {/* 問い合わせフォーム */}
        <Route path="/contact" element={<ContactForm />} />
        {/* 商品リスト */}
        <Route path="/productList" element={<ProductList />} />
        {/* ユーザープロフィール */}
        <Route path="/userprofile" element={<UserProfile />} />
        {/* ユーザーカード */}
        <Route
          path="/usercard"
          element={
            <UserCard
              user={dummyUser}
              onEdit={handleEdit}
              isSelected={true}
            />
          }
        />
        {/* ユーザーリスト */}
        <Route
          path="/userlist"
          element={
            <UserList<User>
              items={users}
              renderItem={(user: User) => (
                <div>
                  <p>名前: {user.name}</p>
                  <p>メール: {user.email}</p>
                </div>
              )}
              keyExtractor={(user: User, index: number) => user.id || index} // `user.id` がない場合にインデックスを使用
              isLoading={loading}
            />
          }
        />
        {/* ステータスボタン */}
        <Route
          path="/status_btn"
          element={
            <div>
              <h2>状態を持つボタン</h2>
              <StatusButton
                status={buttonStatus}
                label="Click Me"
                onClick={handleButtonClick}
              />
            </div>
          }
        />
        <Route path="/counter-demo" element={<CounterDemo />} />
        <Route path="/custom-hook-demo" element={<CustomHookDemo />} />
      </Routes>
    </Router>
  );
}

export default App