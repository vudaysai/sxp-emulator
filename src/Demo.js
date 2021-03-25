import Chat from './ChatBot';

function Form() {
  const existingData = JSON.parse(localStorage.getItem("data"));
  return (
    <div style={{ backgroundImage: `url(${existingData.bgUrl})`, height: '100vh', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
      <Chat />
    </div>
  );
}

export default Form;
