import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => boolean;
  onSignup: (
    name: string,
    email: string,
    password: string,
  ) => { success: boolean; error?: string };
}

export default function AuthModal({
  open,
  onClose,
  onLogin,
  onSignup,
}: AuthModalProps) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupError, setSignupError] = useState("");
  const [showSignupPw, setShowSignupPw] = useState(false);

  const handleLogin = () => {
    setLoginError("");
    if (!loginEmail || !loginPassword) {
      setLoginError("Please fill in all fields");
      return;
    }
    const ok = onLogin(loginEmail, loginPassword);
    if (!ok) {
      setLoginError("Invalid account or password");
    } else {
      onClose();
    }
  };

  const handleSignup = () => {
    setSignupError("");
    if (!signupName || !signupEmail || !signupPassword || !signupConfirm) {
      setSignupError("Please fill in all fields");
      return;
    }
    if (signupPassword !== signupConfirm) {
      setSignupError("Passwords do not match");
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters");
      return;
    }
    const result = onSignup(signupName, signupEmail, signupPassword);
    if (!result.success) {
      setSignupError(result.error || "Signup failed");
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            data-ocid="auth.modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto">
              {/* Header */}
              <div
                className="flex items-center justify-between p-6 pb-4"
                style={{ borderBottom: "1px solid #EEF3F7" }}
              >
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 900,
                      background: "linear-gradient(135deg, #E53935, #40C4FF)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    KT
                  </span>
                  <span
                    className="font-bold text-lg"
                    style={{ color: "#0F1A24" }}
                  >
                    Kazutube
                  </span>
                </div>
                <button
                  type="button"
                  data-ocid="auth.close_button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <Tabs defaultValue="login">
                  <TabsList className="w-full mb-6">
                    <TabsTrigger
                      data-ocid="auth.tab"
                      value="login"
                      className="flex-1"
                    >
                      Log In
                    </TabsTrigger>
                    <TabsTrigger
                      data-ocid="auth.tab"
                      value="signup"
                      className="flex-1"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        data-ocid="auth.input"
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative mt-1">
                        <Input
                          data-ocid="auth.input"
                          id="login-password"
                          type={showLoginPw ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPw((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showLoginPw ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    {loginError && (
                      <p
                        data-ocid="auth.error_state"
                        className="text-sm"
                        style={{ color: "#E53935" }}
                      >
                        {loginError}
                      </p>
                    )}
                    <Button
                      data-ocid="auth.submit_button"
                      onClick={handleLogin}
                      className="w-full font-semibold text-white"
                      style={{ background: "#E53935", border: "none" }}
                    >
                      Log In
                    </Button>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4">
                    <div>
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        data-ocid="auth.input"
                        id="signup-name"
                        placeholder="John Doe"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        data-ocid="auth.input"
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative mt-1">
                        <Input
                          data-ocid="auth.input"
                          id="signup-password"
                          type={showSignupPw ? "text" : "password"}
                          placeholder="••••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPw((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showSignupPw ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="signup-confirm">Confirm Password</Label>
                      <Input
                        data-ocid="auth.input"
                        id="signup-confirm"
                        type="password"
                        placeholder="••••••••"
                        value={signupConfirm}
                        onChange={(e) => setSignupConfirm(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    {signupError && (
                      <p
                        data-ocid="auth.error_state"
                        className="text-sm"
                        style={{ color: "#E53935" }}
                      >
                        {signupError}
                      </p>
                    )}
                    <Button
                      data-ocid="auth.submit_button"
                      onClick={handleSignup}
                      className="w-full font-semibold text-white"
                      style={{ background: "#E53935", border: "none" }}
                    >
                      Create Account
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
