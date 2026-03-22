"use client";

export default function Gallery() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <img
        src="https://directus1/assets/a7d337bd-1aa7-4a3c-982f-e09d593b2566"
        alt="Test"
        style={{ width: 300, borderRadius: 8, border: "2px solid red" }}
      />
    </div>
  );
}