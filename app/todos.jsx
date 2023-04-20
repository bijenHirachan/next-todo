import { TodoItem } from "@/components/ServerComponents";
import { cookies } from "next/headers";

const fetchTodos = async (token) => {
  try {
    const res = await fetch(`${process.env.URL}/api/mytask`, {
      cache: "no-cache",
      headers: {
        cookie: `token=${token}`,
      },
    });

    const data = await res.json();

    if (!data.success) return [];
    return data.tasks;
  } catch (error) {
    return [];
  }
};

const Todos = async () => {
  const token = cookies().get("token")?.value;

  const todos = await fetchTodos(token);

  return (
    <section className="todosContainer">
      {todos?.map((todo) => (
        <TodoItem
          key={todo._id}
          title={todo.title}
          description={todo.description}
          id={todo._id}
          completed={todo.isCompleted}
        />
      ))}
    </section>
  );
};

export default Todos;
