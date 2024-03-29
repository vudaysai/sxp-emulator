/* eslint-disable no-useless-escape */
import { useForm } from "react-hook-form";
import "./App.css";

function Form() {
  const existingData = JSON.parse(localStorage.getItem("data"));
  const { register, handleSubmit, errors } = useForm({ defaultValues: existingData || {} });
  const onSubmit = data => {
    localStorage.setItem("data", JSON.stringify(data))
    window.location = '/demo';
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
        <label>File Server Root URL (optional)</label>
        <input name="fileServerUrl" placeholder="https://fileserver.com/" ref={register} />
        <label>File Server Sub URL</label>
        <input name="fileServerPath" placeholder="/upload/" ref={register} />
        <label>Background URL</label>
        <input name="bgUrl" placeholder="https://image-url/" ref={register} />
        <input className="form-submit" type="submit" value="Save & Reload" />
      </form>
    </>
  );
}

export default Form;
