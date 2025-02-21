import { UserForm } from '../hooks/userForm';
import localforage from 'localforage';
import React, { useEffect, useState } from 'react';


interface UserForm {
  name: string;
  email: string;
  [key: string]: string;
}


function CustomHookDemo() {
  // ローカルストレージからのデータ取得
  const [storedUsers, setStoredUsers] = useState<UserForm[]>([]);


  // 初期データを localforage から取得
  useEffect(() => {
    const fetchStoredUsers = async () => {
      try {
        const users = await localforage.getItem<UserForm[]>('users');
        if (users) {
          setStoredUsers(users); // ローカルストレージから取得したデータをセット
        }
      } catch (error) {
        console.error('Error fetching data from localforage:', error);
      }
    };


    fetchStoredUsers();
  }, []);


  // フォームフックの使用
  const form = UserForm<UserForm>({
    initialValues: { name: '', email: '' }, // 初期値をリセット可能に
    onSubmit: async (values) => {
      console.log('Form submitted:', values);


      const updatedUsers = [...storedUsers, values]; // 新しいユーザーを追加
      setStoredUsers(updatedUsers); // メモリ上の状態を更新


      try {
        await localforage.setItem('users', updatedUsers); // ローカルストレージに保存
      } catch (error) {
        console.error('Error saving data to localforage:', error);
      }
    },
    validate: (values) => {
      const errors: Partial<Record<keyof UserForm, string>> = {};
      if (!values.name) errors.name = '名前を入力してください';
      if (!values.email) errors.email = 'メールアドレスを入力してください';
      return errors;
    },
  });


  return (
    <div className="custom-hook-demo">
      <section>
        <h2>フォーム</h2>
        <form onSubmit={form.handleSubmit}>
          <div>
            <label>
              名前：
              <input
                type="text"
                name="name"
                value={form.values.name}
                onChange={form.handleChange}
              />
            </label>
            {form.errors.name && (
              <span className="error">{form.errors.name}</span>
            )}
          </div>
          <div>
            <label>
              メール：
              <input
                type="email"
                name="email"
                value={form.values.email}
                onChange={form.handleChange}
              />
            </label>
            {form.errors.email && (
              <span className="error">{form.errors.email}</span>
            )}
          </div>
          <button type="submit" disabled={form.isSubmitting}>
            {form.isSubmitting ? '送信中...' : '送信'}
          </button>
        </form>
      </section>


      <section>
        <h2>保存されたデータ</h2>
        <div>
          {storedUsers.map((user, index) => (
            <div key={index}>
              <p>名前: {user.name}</p>
              <p>メール: {user.email}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


export default CustomHookDemo;
