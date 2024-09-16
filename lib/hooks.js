import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import instance from '../utils/api';
import { removeAuthCookie, setAuthCookie } from '../utils/auth-cookies';
import Cookies from "js-cookie";

export const useTopicListColorMode = () => {
  const [colorMode, setColorMode] = useState("light");
  const toast = useToast();

  useEffect(() => {
    const topicListColorMode = localStorage.getItem("topic-list-color-mode");
    if (topicListColorMode) {
      setColorMode(topicListColorMode);
    }
  }, []);

  const toggleColorMode = () => {
    const mode = colorMode === "light" ? "dark" : "light";
    setColorMode(mode);
    localStorage.setItem("topic-list-color-mode", mode);
    toast({
      title: `Switched to ${mode} mode!`,
      description: "",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return [colorMode, toggleColorMode];
};

export const logOut = () => {
  localStorage.clear();
  removeAuthCookie('jwt');
  open('/login', '_self');
};

export const logIn = async (email, password) => {
  const response = await instance.post('/user/login', { email, password });
  setAuthCookie('jwt', response.data.token);
  instance.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
  localStorage.setItem("fName", response.data.user.fName);
  localStorage.setItem("lName", response.data.user.lName);
  const probData = response.data.user.solvedProblems;
  Cookies.set('problems', JSON.stringify(probData));

  const data = response.data.user.progress;
  const completedTopics = {};
  data.forEach((category) => {
    category.sub_categories.forEach((subCategory) => {
      subCategory.topics.forEach((topic) => {
        completedTopics[topic] = true;
      });
    });
  });
  Cookies.set("progress", JSON.stringify(completedTopics));

  return response.data;
};

export const signUp = async (fName, lName, email, password) => {
  try {
    const response = await instance.post('/user/signup', { fName, lName, email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // check if user is logged in (e.g., using a token or session)
    const token = Cookies.get('jwt');
    if (token) {
      setIsLoggedIn(true);
    } else {
      Cookies.remove('progress');
      localStorage.clear();
    }
  }, []);

  return isLoggedIn;
};

export const getCompletedProblems = () => {
  const data = Cookies.get("progress");
  if (!data) return {};
  return JSON.parse(data);
}

export const getLatestCompletedProblems = async () => {
  await instance.get("/progress").then((resp) => {
    const probData = resp.data.userProgress.problemsProgress;
    Cookies.set('problems', JSON.stringify(probData));
    const data = resp.data.userProgress.topicProgress;
    
    if (!data) return {};
    const completedTopics = {};
    data.forEach((category) => {
      category.sub_categories.forEach((subCategory) => {
        subCategory.topics.forEach((topic) => {
          completedTopics[topic] = true;
        });
      });
    });
    Cookies.set('progress', JSON.stringify(completedTopics));
  }).catch((err) => {
    console.log(err);
  });
}

export const getSolvedProblemsByTopic = (topicId) => {
  const data = Cookies.get("problems");
  if (!data) return [];
  const allData = JSON.parse(data);
  const topic = allData.find(item => item.topic_id === topicId);
  
  return topic?.problems ?? [];
}
