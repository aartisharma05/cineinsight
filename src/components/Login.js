import { useState , useRef} from "react";
import Header from "./Header";
import {checkValidData} from "../utils/validate"
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,

} from "firebase/auth";
import {auth} from "../utils/firebase";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { USER_AVATAR, BG_URL } from "../utils/constants";



const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  const name = useRef(null);//name validation
  const email = useRef(null);
  const password = useRef(null);



  const handleButtonClick = ()=>{

  const message = checkValidData(email.current.value, password.current.value);
  setErrorMessage(message);

   if(message) return;

   //sign In or Sign up logic
   if(!isSignInForm){

    //sign Up Logic

    createUserWithEmailAndPassword(
      auth,
      email.current.value,  
      password.current.value
    )
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        updateProfile(user, {
          displayName: name.current.value,
          photoURL:USER_AVATAR,
        })
          .then(() => {
           
             const { uid, email, displayName, photoURL } = auth.currentUser;
             dispatch(
               addUser({
                 uid: uid,
                 email: email,
                 displayName: displayName,
                 photoURL: photoURL,
               })
             );

          })
          .catch((error) => {
            setErrorMessage(error.message);
          });

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(errorCode + "-" +errorMessage)
        // ..
      });

   }
   else{
    //sign In logic
    signInWithEmailAndPassword(
      auth,
      email.current.value,
      password.current.value
    )
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
  
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(errorCode,errorMessage)
        
      });

   }
 


  }
    
  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
  };
  return (
    <div>
      <Header />
      <div className="absolute w-full h-screen">
        <img src={BG_URL} alt="logo" className="w-full h-full object-cover" />
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="absolute w-full mx-auto p-4 md:w-1/4 bg-black right-0 left-0 sm:px-10 sm:my-6 sm:py-2 sm:mx-auto  md:px-12 md:py-4  my-52  md:mt-[40%] lg:my-36 bg-opacity-90 rounded-md"
      >
        <h1 className="font-bold text-white text-xl md:text-2xl py-4">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>
        {!isSignInForm && (
          <input
            ref={name}
            type="text"
            placeholder="Full Name"
            className="p-2 my-2 w-full bg-gray-700 rounded-md "
          />
        )}
        <input
          ref={email}
          type="text"
          placeholder="Email Address"
          className="p-2 my-2 w-full bg-gray-700 rounded-md "
        />
        <input
          ref={password}
          type="password"
          placeholder="Password"
          className="p-2 my-2 w-full bg-gray-700 rounded-md "
        />
        <p className="text-red-700 text-lg p-1">{errorMessage}</p>
        <button
          className="p-4 my-4 bg-red-700 text-white rounded-md w-full"
          onClick={handleButtonClick}
        >
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>
        <p
          className="py-4 cursor-pointer text-white"
          onClick={toggleSignInForm}
        >
          {isSignInForm ? (
            <span>
              New to CineInsight?{" "}
              <span style={{ color: "blue", textDecoration: "underline" }}>
              
                Sign Up
              </span>{" "}
              Now
            </span>
          ) : (
            <span>
              Already regstered?{" "}
              <span style={{ color: "blue", textDecoration: "underline" }}>
                Sign In
              </span>{" "}
              Now...
            </span>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;



