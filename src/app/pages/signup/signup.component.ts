
onSignup() {
  this.authService.signup({
    email: this.email,
    password: this.password
  }).subscribe({
    next: () => {
      console.log('Signup success');
    },
    error: (err) => {
      console.error(err);
    }
  });
}