import React, { useState } from "react";
import Filterbar, { FilterLabel } from "../components/Filterbar";
import Layout from "../components/Layout";
import Todo from "../components/Todo";
import useTodos from "../hooks/useTodos";

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState<FilterLabel>("All");
  const { todos, error, itemsLeft } = useTodos({
    filterBy: selectedFilter,
  });

  if (error) return <div>ERROR! {error.message}</div>;

  const handleChangeFilter = (newFilter: FilterLabel) => {
    setSelectedFilter(newFilter);
  };

  return (
    <Layout pageTitle="TODO">
      <div className="flex flex-col justify-start items-center space-y-7 w-full">
        <Todo createNewTodo autoFocus placeholder="Create a new todo..." />
        <div className="w-full h-full rounded-md">
          {!todos && <Todo />}
          {todos && todos.map((todo, i) => <Todo key={i} todoData={todo} />)}
          <Filterbar
            itemsLeft={itemsLeft}
            filters={["All", "Active", "Completed"]}
            selected={selectedFilter}
            onChangeFilter={handleChangeFilter}
          />
        </div>
      </div>
    </Layout>
  );
}
