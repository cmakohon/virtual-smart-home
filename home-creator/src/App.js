import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineHome, AiFillGithub, AiOutlineCopy } from "react-icons/ai";
import RingLoader from "react-spinners/RingLoader";
import "./App.css";

function App() {
  const url =
    "https://us-central1-virtual-smart-home-8c6b8.cloudfunctions.net/createHome?name=";
  const { register, handleSubmit } = useForm();
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    setLoading(true);
    fetch(url + encodeURIComponent(data.homeName))
      .then((response) => response.json())
      .then((response) => {
        setId(response.result);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  };

  const onCopy = () => {
    navigator.clipboard.writeText(id).then(function() {
      //copy success
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

  return (
    <div className="App">
      <div className="container">
        <h1>
          <AiOutlineHome
            style={{
              marginRight: "1.5rem",
              fontSize: "36pt",
              marginBottom: "-8px",
            }}
          />
          Create your home
        </h1>
        {!loading && !id && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              name="homeName"
              ref={register}
              placeholder="Home name"
              required
            />
            <input type="submit" />
          </form>
        )}
        {loading && (
          <RingLoader size={42} color={"#92DCE5"} loading={loading} />
        )}
        {!loading && id && (
          <div className="result">
            <span className="result-id">{id}</span>
            <AiOutlineCopy
              onClick={onCopy}
              color={'#92DCE5'}
              style={{
                marginLeft: "1rem",
                fontSize: "16pt",
                marginBottom: "-4px",
                cursor: 'pointer'
              }}
          />
          </div>
        )}
      </div>
      <a href="https://github.com/cmakohon" className="footer">
        <AiFillGithub
          style={{
            marginRight: ".5rem",
            fontSize: "16pt",
            marginBottom: "-4px",
          }}
        />
        github.com/cmakohon
      </a>
    </div>
  );
}

export default App;
