import React, {useState, useEffect} from 'react';
import { Card, Table, Input, Button } from 'antd';
import { CheckOutlined, CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import 'antd/dist/antd.min.css';

type todoObject = {
    id: number;
    title: string;
    completed: boolean
};

export default function Todo() {
    const [loading, setLoading] = useState<boolean>(false);
    const [newTodo, setNewTodo] = useState<string>("");
    const [todos, setTodos] = useState<todoObject[]>([]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const { data } = await axios.get("https://jsonplaceholder.typicode.com/todos");
            setTodos(data);
            setLoading(false);
        })()
    }, [])

    const setNewTodoValue = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setNewTodo(e.target.value);
    }

    const addNewTodoToList = (): void => {
        let tempArray = [...todos];
        const length = tempArray.length - 1;
        let tempTodo = {
            id: tempArray[length].id + 1,
            title: newTodo,
            completed: false
        }
        tempArray.push(tempTodo);
        setTodos(tempArray);
        setNewTodo("");
    }

    const completeATodo = (id: number): void => {
        let tempArray = [...todos];
        const index = tempArray.findIndex(object => {
            return object.id === id;
        });
        tempArray[index].completed = true;
        setTodos(tempArray);
    }

    const deleteTodo = (id: number): void => {
        let tempArray = [...todos];
        const index = tempArray.findIndex(object => {
            return object.id === id;
        });
        tempArray.splice(index, 1);
        setTodos(tempArray);
    }
    
    return (
        <div>
            <h2>Todo App</h2>
            <div style={{width: "30%", backgroundColor: "#D3D3D3", marginInline: 'auto'}}>
                <h4>Add a new todo item</h4>
                <Input placeholder='title' value={newTodo} onChange={setNewTodoValue} />
                <Button onClick={addNewTodoToList}>Add Todo</Button>
            </div>
            {loading ? <LoadingOutlined style={{ fontSize: 24 }} spin/>
            :
            <Card>
                <h4>Click on a table column header to sort table</h4>
                <Table
                    dataSource={todos}
                    pagination={false}
                    rowKey='id'
                >
                    <Table.Column
                        title="ID"
                        dataIndex="id" 
                        key="id"
                        sorter={(a: todoObject, b: todoObject) => a.id > b.id ? -1 : 1}
                    />
                    <Table.Column
                        title="Name"
                        dataIndex="title"
                        key="title"
                        sorter={(a: todoObject, b: todoObject) => {
                            return a.title > b.title ? -1 : b.title > a.title ? 1 : 0;
                        }}
                    />
                    <Table.Column
                        title="Status"
                        key="action"
                        align='center'
                        sorter={(a: todoObject, b: todoObject) => a.completed === b.completed ? 1 : -1}
                        render={(record) => (
                            <>
                                {record.completed ? <CheckOutlined style={{ fontSize: '20px', color: 'green' }} />
                                    : 
                                    <Button onClick={() => completeATodo(record.id)}>Todo</Button>
                                }
                            </>
                        )}
                    />
                    <Table.Column
                        title="Delete"
                        key="action"
                        align='center'
                        render={(record) => (
                            <CloseOutlined style={{ fontSize: '20px', color: 'red' }} onClick={() => deleteTodo(record.id)} />
                        )}
                    />
                </Table>
            </Card>
            }
        </div>
    )
}
