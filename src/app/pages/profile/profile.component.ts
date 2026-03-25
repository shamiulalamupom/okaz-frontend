
user: any;

constructor(private authService: AuthService) {}

ngOnInit() {
  this.authService.currentUser$.subscribe(user => {
    this.user = user;
  });
}