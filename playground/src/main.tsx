import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "react-folder-tree/styles.css"
import { App } from "./App"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
