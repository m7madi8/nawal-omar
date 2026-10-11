import LegacyPage from '@/components/LegacyPage';
import { ADMIN_SCRIPTS, ADMIN_STYLES, buildAdminInlineScript } from '@/lib/adminWorkspace';

export const metadata = {
  title: 'Admin Login | Nawal Yoga',
};

export default function Page() {
  return (
    <LegacyPage
      lang="en"
      dir="ltr"
      bodyClassName="login-body"
      styles={ADMIN_STYLES}
      scripts={ADMIN_SCRIPTS}
      inlineScripts={[buildAdminInlineScript()]}
      html={`
  <main class="login-shell">
    <section class="login-card">
      <div class="login-mark" aria-hidden="true">
        <img src="/media/home/nawal_aom.jpg" alt="" width="44" height="44">
      </div>
      <p class="login-kicker">Operations</p>
      <h1>Welcome back</h1>
      <p class="login-subtitle">Sign in as Nawal or a team member to manage practice, retreats, shop, and community care.</p>

      <form id="loginForm" class="login-form" novalidate autocomplete="off">
        <label for="username">Username</label>
        <input id="username" name="username" type="text" autocomplete="off" placeholder="Enter username" required>

        <label for="password">Password</label>
        <input id="password" name="password" type="password" autocomplete="current-password" placeholder="Enter password" required>

        <label class="login-remember">
          <input id="rememberMe" name="rememberMe" type="checkbox" checked>
          <span>Keep me signed in on this device</span>
        </label>

        <p id="loginError" class="form-error" aria-live="polite"></p>
        <button type="submit" class="btn btn-primary">Sign in</button>
      </form>
    </section>
  </main>
`}
    />
  );
}
