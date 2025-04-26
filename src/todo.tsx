import React, { useState, useEffect } from 'react';
import TodoItem from './components/TodoItem'; // 相対パスを正しく設定
import type { Todo } from './types'; // type-only import で型をインポート
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'; // DnD用に追加

// "Todo" 型の定義をコンポーネントを削除又はコメントアウト
// export interface Todo {
//   content: string;
//   readonly id: number;
//   completed_flg: boolean;
//   delete_flg: boolean;
// }

// 特定のTodoのプロパティを更新する関数
// const handleTodo = <K extends keyof Todo, V extends Todo[K]>(
//   id: number,
//   key: K,
//   value: V
// ) => {
//   const updatedTodos = todos.map(todo =>
//     todo.id === id ? { ...todo, [key]: value } : todo
//   );

//   setTodos(updatedTodos);

//   const todo = updatedTodos.find(todo => todo.id === id);
//   if (todo) {
//     updateTodo(id, todo);
//   }
// };

// "Todo" 型の定義をコンポーネント外で行います

  type Todo = {
    content: string;
    readonly id: number;
    completed_flg: boolean;
    delete_flg: boolean;
    sort?: number; // ここ追加
  };

type Filter = 'all' | 'completed' | 'unchecked' | 'delete';

// Todo コンポーネントの定義
const Todo: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]); // Todoの配列を保持するステート
  const [text, setText] = useState('');
  const [nextId, setNextId] = useState(1); // 次のTodoのIDを保持するステート
  // 追加
  const [filter, setFilter] = useState<Filter>('all');

  const isFormDisabled = filter === 'completed' || filter === 'delete';

  const handleFilterChange = (filter: Filter) => {
    setFilter(filter);
  };

  // コンポーネントマウント時にRails APIからデータを取得
  useEffect(() => {
    fetchTodos().then(data => setTodos(data)); // 全てのタスクを取得
  }, []);
// フィルタリングされたタスクリストを取得する関数
const getFilteredTodos = () => {
  switch (filter) {
    case 'completed':
      // 完了済み **かつ** 削除されていないタスクを返す
      return todos.filter((todo) => todo.completed_flg && !todo.delete_flg);
    case 'unchecked':
      // 未完了 **かつ** 削除されていないタスクを返す
      return todos.filter((todo) => !todo.completed_flg && !todo.delete_flg);
    case 'delete':
      // 削除されたタスクを返す
      return todos.filter((todo) => todo.delete_flg);
    default:
      // 削除されていないすべてのタスクを返す
      return todos.filter((todo) => !todo.delete_flg);
  }
};

  // 物理的に削除する関数
  const handleEmpty = () => {
    const filteredTodos = todos.filter(todo => !todo.delete_flg);
    const deletePromises = todos
      .filter(todo => todo.delete_flg)
      .map(todo => deleteTodo(todo.id));

    Promise.all(deletePromises).then(() => setTodos(filteredTodos));
  };
    // コンポーネントマウント時にRails APIからデータを取得
    useEffect(() => {
      fetch("http://localhost:3031/api/v1/todos")
        .then(response => response.json())
        .then(data => setTodos(data));
    }, []);

  // 新しいTodoを作成する関数
  const handleSubmit = () => {
    if (!text) return;

    const newTodo: Omit<Todo, 'id'> = {
      content: text,
      completed_flg: false,
      delete_flg: false,
    };

    createTodo(newTodo).then(data => {
      setTodos((prevTodos) => [data, ...prevTodos]);
      setNextId(nextId + 1); // 次のTodoIDをインクリメント
      setText(''); // フォームの入力をクリア
    });
  };
  

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      console.log("ドラッグがキャンセルされました");
      return;
    }

    const newTodos = Array.from(todos);
    const [movedTodo] = newTodos.splice(result.source.index, 1);
    newTodos.splice(result.destination.index, 0, movedTodo);

    // 並び替え後のUIを即時更新
    setTodos(newTodos);
    console.log("並べ替え後のTodos:", newTodos);

    // サーバー側に並び替え結果を非同期で送信
    newTodos.forEach((todo, index) => {
      todo.sort = index + 1;
      updateTodo(todo.id, todo).catch((error) => {
        console.error(`Todo ${todo.id} の更新に失敗しました:`, error);
      });
    });
  };

  return (
    <div className="todo-container">
      <select
        defaultValue="all"
        onChange={(e) => handleFilterChange(e.target.value as Filter)}
      >
        <option value="all">すべてのタスク</option>
        <option value="completed">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="delete">ごみ箱</option>
      </select>
  
      {filter === 'delete' && (
        <button onClick={handleEmpty}>ごみ箱を空にする</button>
      )}
      {filter !== 'completed' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit">追加</button>
        </form>
      )}
  
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {getFilteredTodos().map((todo, index) => (
                <Draggable
                  key={todo.id}
                  draggableId={String(todo.id)}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <TodoItem
                      todo={todo}
                      updateTodo={updateTodo}
                      setTodos={setTodos}
                      todos={todos}
                      index={index}
                      provided={provided}
                      snapshot={snapshot}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Todo;