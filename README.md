# quirky diary
  
- Setup:  
    run `npm install`  
    edit the env file to add mongo credentials
- Serving:  
    run `npm run dev`  
    *in case of this error*
    >``[nodemon] Internal watch failed: ENOSPC: System limit for number of file watchers reached...``  

    run this command to allow max watchers `echo fs.inotify.max_user_watches=582222 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`
