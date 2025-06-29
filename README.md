# Family Messaging App (Rails + React + Vite)

A secure, private messaging platform built for kids to message their parent (me!) in a closed environment. Built to run in-browser on our household devices.

## Features
- Vite-powered React frontend
- Rails 7 API backend
- PostgreSQL for persistent data
- Redis for ActionCable (websockets)
- Emoji picker, typing indicators, and message timestamps

## Stack
- **Frontend**: React 19, Vite, Axios, Emoji Picker
- **Backend**: Ruby 3.1.3, Rails 7.0.4, PostgreSQL, Redis
- **Security**: Manual user creation only, no public login or registration
- **Deployment**: Render (fullstack)

## Local Setup
```bash
bundle install
rails db:setup
cd client && npm install && npm run dev
```

## Notes
Built entirely from scratch as a full-stack monorepo. No scaffold generators used. Chat is handled via ActionCable.

## Author
Alisha Taylor — Parent, Engineer, and Safety First Advocate
