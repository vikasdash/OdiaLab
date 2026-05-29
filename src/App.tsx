import React, { useState, useEffect } from "react";
import AppShell from "./components/AppShell";
import HomeTab from "./components/HomeTab";
import CoursesTab from "./components/CoursesTab";
import PracticeTab from "./components/PracticeTab";
import AIDeskTab from "./components/AIDeskTab";
import ProfileTab from "./components/ProfileTab";
import { INITIAL_PROFILE, INITIAL_PLANNER } from "./data";
import { StudentProfile, StudyPlannerItem } from "./types";

// Firebase imports
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { handleFirestoreError, OperationType } from "./utils/firebaseHelpers";

export default function App() {
  // Mobile app navigation state
  const [activeTab, setActiveTab] = useState<string>("home");
  
  // Student parameters stored in state for dynamic interactivity across tabs
  const [profile, _setProfile] = useState<StudentProfile>(INITIAL_PROFILE);
  const [planner, _setPlanner] = useState<StudyPlannerItem[]>(INITIAL_PLANNER);
  const [streak, setStreak] = useState<number>(profile.streak);

  // Firebase Auth states
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  
  // Track courses joined by student (starting enrolled in OSSC 1-on-1 Peer Match board)
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(["ossc-peer-room"]);
  
  // Global category filters for Courses
  const [goalSelectedCategory, setGoalSelectedCategory] = useState<string>("All");

  // Intercepting setters to support hybrid sync (cloud Firestore if authenticated, localStorage if Guest)
  const setProfile = (updater: React.SetStateAction<StudentProfile>) => {
    _setProfile(prev => {
      const next = typeof updater === "function" ? (updater as Function)(prev) : updater;
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        setDoc(userRef, next).catch(err => {
          handleFirestoreError(err, OperationType.WRITE, `users/${auth.currentUser?.uid}`);
        });
      } else {
        localStorage.setItem("odi_guest_profile", JSON.stringify(next));
      }
      return next;
    });
  };

  const setPlanner = (updater: React.SetStateAction<StudyPlannerItem[]>) => {
    _setPlanner(prev => {
      const next = typeof updater === "function" ? (updater as Function)(prev) : updater;
      if (auth.currentUser) {
        // Find deleted items from previous state
        const deleted = prev.filter(p => !next.some(n => n.id === p.id));
        deleted.forEach(item => {
          const itemRef = doc(db, "users", auth.currentUser!.uid, "planner", item.id);
          deleteDoc(itemRef).catch(err => {
            handleFirestoreError(err, OperationType.DELETE, `users/${auth.currentUser?.uid}/planner/${item.id}`);
          });
        });
        // Set/update current items
        next.forEach(item => {
          const itemRef = doc(db, "users", auth.currentUser!.uid, "planner", item.id);
          setDoc(itemRef, item).catch(err => {
            handleFirestoreError(err, OperationType.WRITE, `users/${auth.currentUser?.uid}/planner/${item.id}`);
          });
        });
      } else {
        localStorage.setItem("odi_guest_planner", JSON.stringify(next));
      }
      return next;
    });
  };

  // Google Login popup authentication workflow
  const onLoginWithGoogle = async () => {
    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.warn("Google authentication closed or failed", err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const onLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout abort failed", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Authenticated! Sync/fetch from Firestore
        const userRef = doc(db, "users", currentUser.uid);
        try {
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const fbProfile = snap.data() as StudentProfile;
            _setProfile(fbProfile);
            setStreak(fbProfile.streak);
          } else {
            const newProfile: StudentProfile = {
              name: currentUser.displayName || "Odia Candidate",
              email: currentUser.email || "",
              goal: "OPSC Civil Services (OAS) & OSSC Exam Preparation",
              streak: 1,
              studyMinutes: 0,
              joinDate: new Date().toLocaleString("default", { month: "long", year: "numeric" }),
              savedNotes: [],
              solvedCount: 0
            };
            await setDoc(userRef, newProfile);
            _setProfile(newProfile);
            setStreak(newProfile.streak);
          }

          // Subcollection sync
          const plannerRef = collection(db, "users", currentUser.uid, "planner");
          const plannerSnap = await getDocs(plannerRef);
          if (!plannerSnap.empty) {
            const list: StudyPlannerItem[] = [];
            plannerSnap.forEach((docSnap) => {
              list.push(docSnap.data() as StudyPlannerItem);
            });
            _setPlanner(list);
          } else {
            // Write standard defaults to subcollection
            const batchPromises = INITIAL_PLANNER.map(async (item) => {
              const itemRef = doc(db, "users", currentUser.uid, "planner", item.id);
              await setDoc(itemRef, item);
            });
            await Promise.all(batchPromises);
            _setPlanner(INITIAL_PLANNER);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${currentUser.uid}`);
        }
      } else {
        // Guest mode! Restore or set defaults
        const localProfile = localStorage.getItem("odi_guest_profile");
        const localPlanner = localStorage.getItem("odi_guest_planner");
        
        if (localProfile) {
          try {
            const parsed = JSON.parse(localProfile) as StudentProfile;
            _setProfile(parsed);
            setStreak(parsed.streak);
          } catch {
            _setProfile(INITIAL_PROFILE);
            setStreak(INITIAL_PROFILE.streak);
          }
        } else {
          _setProfile(INITIAL_PROFILE);
          setStreak(INITIAL_PROFILE.streak);
        }

        if (localPlanner) {
          try {
            _setPlanner(JSON.parse(localPlanner) as StudyPlannerItem[]);
          } catch {
            _setPlanner(INITIAL_PLANNER);
          }
        } else {
          _setPlanner(INITIAL_PLANNER);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AppShell 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      streak={streak}
      profile={profile}
      user={user}
    >
      {/* 
        Conditional tab layouts mapping. Content scrolling is managed by scrollable
        containers inside AppShell wrapper to prevent standard viewport leakage.
      */}
      {activeTab === "home" && (
        <HomeTab 
          profile={profile} 
          setProfile={setProfile} 
          planner={planner} 
          setPlanner={setPlanner}
          setActiveTab={setActiveTab}
          setStreak={setStreak}
          setGoalSelectedCategory={setGoalSelectedCategory}
          user={user}
        />
      )}

      {activeTab === "courses" && (
        <CoursesTab 
          profile={profile} 
          setProfile={setProfile}
          activeCategory={goalSelectedCategory}
          setActiveCategory={setGoalSelectedCategory}
          enrolledCourses={enrolledCourses}
          setEnrolledCourses={setEnrolledCourses}
        />
      )}

      {activeTab === "practice" && (
        <PracticeTab 
          profile={profile} 
          setProfile={setProfile} 
        />
      )}

      {activeTab === "ai" && (
        <AIDeskTab 
          profile={profile} 
          setProfile={setProfile} 
          category={goalSelectedCategory}
        />
      )}

      {activeTab === "profile" && (
        <ProfileTab 
          profile={profile} 
          setProfile={setProfile} 
          planner={planner} 
          setPlanner={setPlanner}
          enrolledCoursesCount={enrolledCourses.length}
          user={user}
          onLoginWithGoogle={onLoginWithGoogle}
          onLogout={onLogout}
          isLoggingIn={isLoggingIn}
        />
      )}
    </AppShell>
  );
}
