export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="shell section prose-col" style={{ marginInline: "auto" }}>
      <h1>Privacy</h1>
      <p>
        We store account email, session cookies, and content you submit. Passwords are hashed
        (scrypt). API and bot keys are stored hashed. Analytics stay within Vercel free allowances.
      </p>
      <p>Contact the owner to request account deletion.</p>
    </div>
  );
}
