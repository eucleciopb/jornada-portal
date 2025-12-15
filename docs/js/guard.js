import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getUserProfile } from "./db.js";

export function requireAuth({ allowRoles = [], onOk }) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const profile = await getUserProfile(user.uid);
    if (!profile || profile.ativo !== true) {
      alert("Perfil não cadastrado ou usuário inativo.");
      window.location.href = "login.html";
      return;
    }

    if (allowRoles.length && !allowRoles.includes(profile.role)) {
      alert("Acesso negado para este perfil.");
      window.location.href = "login.html";
      return;
    }

    onOk?.(user, profile);
  });
}