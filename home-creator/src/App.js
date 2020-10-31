import { useForm } from "react-hook-form";
import "./App.css";

function App() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    fetch("https://us-central1-virtual-smart-home-8c6b8.cloudfunctions.net/createHome?name=" + data.homeName)
      .then(response=>response.json())
      .then(response => {
        console.log(response.result);
      })
      .catch((err) => {});
  };
  return (
    <div className="App">
      <h1>Create your home</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input name="homeName" ref={register} />
        <input type="submit" />
      </form>
    </div>
  );
}

export default App;
