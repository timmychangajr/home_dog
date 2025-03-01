import { useEffect, useState } from "react";
import DefaultText from "../components/DefaultText";
import { cn } from "../lib/utils";
import DefaultInput from "../components/DefaultInput";
import { useNavigate, useSearchParams } from "react-router-dom";
import DefaultButton from "../components/DefaultButton";
import { DogIcon } from "lucide-react";
import login from "../services/auth";
import { useDispatch, useSelector } from "react-redux";
import { saveUser } from "../store/userSlice";
import { RootState } from "../store";
import { showToast } from "../store/toastSlice";

export default function Login() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [email, setEmail] = useState(user.email);
  const navParams = useSearchParams();
  const [username, setUserName] = useState(user.username);
  const navigate = useNavigate();

  const onSubmit = async () => {
    await login(username, email, navigate);
    dispatch(saveUser({ username, email }));
    dispatch(showToast({
      title: 'Login Successful',
      type: 'success',
    }));
  }

  useEffect(() => {
    if (user.lastLogin) {
      login(username, email, navigate)
    }
  }, [user.lastLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className={cn("bg-[var(--bg-secondary)] rounded-lg shadow-lg p-6 border border-[var(--border-primary)]")}>
          <DogIcon size={80} className='mx-auto' color='var(--text-primary)' />
          <DefaultText fontSize='large' className='flex justify-center mt-4 text-[var(--accent-vivid)]' weight="bold">Welcome!</DefaultText>
          <DefaultText fontSize='normal' className='flex justify-center mb-4 text-[var(--text-secondary)]' weight="bold">Log into your account</DefaultText>
          <DefaultText weight="bold" className="text-[var(--text-muted)]">Name</DefaultText>
          <DefaultInput
            className="my-4"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            style={{
              color: 'var(--text-primary)',
            }}
          />
          <DefaultText weight="bold" className="text-[var(--text-muted)]">Email</DefaultText>
          <DefaultInput
            className="my-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              color: 'var(--text-primary)',
            }}
          />
          <DefaultButton onClick={onSubmit}>
            Login
          </DefaultButton>
        </div>
      </main>
    </div>
  );
}