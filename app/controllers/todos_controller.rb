class TodosController < ApplicationController
  def index
    @todo = Todo.new
    @todos = Todo.order(created_at: :desc)
    @editing_todo_id = params[:edit].presence&.to_i
  end

  def create
    @todo = Todo.new(todo_params)

    if @todo.save
      redirect_to root_path, notice: "Todo added."
    else
      @todos = Todo.order(created_at: :desc)
      render :index, status: :unprocessable_content
    end
  end

  def update
    todo = Todo.find(params[:id])

    if todo.update(todo_update_params)
      redirect_to root_path, notice: "Todo updated."
    else
      @todo = Todo.new
      @todos = Todo.order(created_at: :desc)
      @editing_todo_id = todo.id
      flash.now[:alert] = todo.errors.full_messages.to_sentence.presence || "Could not update todo."
      render :index, status: :unprocessable_content
    end
  end

  def destroy
    Todo.find(params[:id]).destroy
    redirect_to root_path, notice: "Todo removed."
  end

  private

  def todo_params
    params.require(:todo).permit(:title)
  end

  def todo_update_params
    params.require(:todo).permit(:completed, :title)
  end
end
