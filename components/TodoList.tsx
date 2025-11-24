"use client";
import { api } from "@/api/api";
import { useEffect, useState } from "react";
import style from "./TodoList.module.css";

interface Todo {
	_id: number;
	id: number;
	text: string;
	completed: boolean;
}

export default function TodoList() {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [Inpvalue, setInpValue] = useState<string>("");

	// Get
	const getTodos = async () => {
		const response = await api.get("/todolist");
		setTodos(response.data.data);
	};

	useEffect(() => {
		getTodos();
	}, []);

	//* Create
	const createTodo = async () => {
		if (Inpvalue != "") {
			const newTodo = {
				text: Inpvalue,
				completed: false,
			};

			await api.post("/todolist", newTodo);
			await getTodos();
			setInpValue("");
		}
	};

	//* Complete
	const completeTodo = async (id: number) => {
		const updatedTodos = todos.map(todo =>
			todo._id === id ? { ...todo, completed: !todo.completed } : todo
		);
		const updatedTodo = updatedTodos.find(todo => todo._id === id);

		await api.patch(`/todolist/${id}`, { completed: updatedTodo?.completed });
		await getTodos();
	};

	//! Delete
	const deleteTodo = async (id: number) => {
		await api.delete(`/todolist/${id}`);
		await getTodos();
	};

	return (
		<div>
			<div className={style.container}>
				{/* prompt */}
				<div className={style.propmt}>
					<input
						type="text"
						value={Inpvalue}
						onChange={e => setInpValue(e.target.value)}
					/>
					<button onClick={createTodo}>ADD</button>
				</div>

				{/* content */}
				<div>
					<ul>
						{todos.map((todo, index) => {
							return (
								<div key={index} className={style.todoItem}>
									<li
										style={
											todo.completed == true
												? {
														textDecoration: "line-through",
														color: "yellowgreen",
												  }
												: { textDecoration: "none" }
										}
									>
										{todo.text}
									</li>
									<button onClick={() => completeTodo(todo._id)}>
										Complete
									</button>
									<button onClick={() => deleteTodo(todo._id)}>Delete</button>
								</div>
							);
						})}
					</ul>
				</div>
			</div>
		</div>
	);
}
