import { useForm } from "react-hook-form";
import ChatBot from './ChatBot';
import "./App.css";

function App() {
  const existingData = JSON.parse(localStorage.getItem("data"));
  const { register, handleSubmit, errors } = useForm({ defaultValues: existingData || {} });
  const onSubmit = data => {
    localStorage.setItem("data", JSON.stringify(data))
    window.location.reload(false);
  };


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Socket URL & Connection Path</label>
        <input name="url" placeholder="https://sxp.com/" ref={register({ required: true, pattern: /(https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(:?\d*)\/?([a-z_\/0-9\-#.]*)\??([a-z_\/0-9\-#=&]*)/g })} />
        {errors.url && <p className="error">Enter Valid URL</p>}
        <input name="path" placeholder="/path/" ref={register} />
        <label>App ID</label>
        <input
          name="appId"
          ref={register({ required: true })}
        />
        {errors.appId && <p className="error">APP ID required</p>}
        <label>User (optional)</label>
        <input name="botId" placeholder="user" ref={register} />
        <label>File Server URL (optional)</label>
        <input name="fileServerUrl" placeholder="https://sxp.com/" ref={register} />
        <input className="form-submit" type="submit" value="Save & Reload" />
      </form>
      <ChatBot />
    </>
  );
}

export default App;
