import './scss/style.scss'
import MarkdownIt from 'markdown-it'

let messages: any = [];

document.querySelector<HTMLDivElement>('#app')!.innerHTML = /*html*/`
  <div class="container-fulid">
  <div class="row">
    <!-- Sidebar -->
    <nav class="col-2 d-md-block">
      <div class="sidebar-sticky">
        <ul class="nav flex-column">
          <li class="nav-item">
            <a class="nav-link btn btn-primary btn-block w-100 active mb-1 text-white" href="#home" role="button">
              <i class="fas fa-home"></i>
              Chat
            </a>
          </li>
          <!-- <li class="nav-item">
            <a class="nav-link btn btn-light btn-block w-100 active mb-1" href="#users">
              <i class="fas fa-users"></i>
              Users
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link btn btn-light btn-block w-100 active mb-1" href="#settings">
              <i class="fas fa-cog"></i>
              Settings
            </a>
          </li> -->
        </ul>
      </div>
    </nav>
    <!-- End of Sidebar -->

    <!-- Main Content -->
    <main class="col-10 pt-3 px-4 vh-100">
      <div class="page active h-100" id="home">
        <div class="row h-100">
  
          <div class="col-12 b" style="height: 80%;">
            <div id="markdown"></div>
          </div>
          <div class="col-12" style="height: 20%">
            <textarea id="editor-container" class="w-100 withbtn m-10 p-3"></textarea>
            <button id="chat-submit" class="btn btn-primary btn-block w-100 active mt-2">submit</button>
          </div>
        </div>
      </div>
      <div class="page h-100" id="users">
      </div>
      <div class="page h-100" id="settings">
      </div>
    </main>
    <!-- End of Main Content -->
  </div>
</div>

`

var md = new MarkdownIt();
const navLinks = document.querySelectorAll('nav ul li a');
const pages = document.querySelectorAll('.page');
var markdown = document.querySelectorAll("#markdown")[0];

navLinks.forEach((link, id1) => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navLinks.forEach((navLink, id2) => {
      navLink.classList.remove("btn-light", "text-white", "text-dark");
      if (id1 === id2)
      {
        navLink.classList.add("btn-primary", "text-white");

      }
      else 
      {
        navLink.classList.add("btn-light", "text-dark");
      }
    });
    link.classList.add('active');
    // Hide all pages
    pages.forEach(page => {
      page.classList.remove('active');
    });

    // Show the selected page
    var targetId = link.getAttribute('href');
    if (targetId != null){
      let target = document.querySelector(targetId);
      target?.classList.add('active');
    }
  });
});

var textareaElement: any = document.querySelector("#editor-container");

let chatSubmit = document.querySelector("#chat-submit");
chatSubmit?.addEventListener("click", async () => {
  // console.log(textareaElement?.value);

  addToMessage("user", textareaElement?.value);
  textareaElement.value = "";

  const response = await fetch("http://localhost:3000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages: messages }),
  });

  const data = await response.json();
  addToMessage(data.message.role, data.message.content);

  if (response.status !== 200) {
    throw data.error || new Error(`Request failed with status ${response.status}`);
  }
});

function addToMessage(role: string, content: string) 
{
  messages.push({
    role: role,
    content: content
  });

  console.log(messages);

  markdown.innerHTML += md.render(content);
}


