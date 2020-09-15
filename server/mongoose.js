const daniel = new Student({
  name : "Daniel",
  score:300,
});
const yontan = new Student({
  name : "Yontan",
  score:282,
});
const baraa = new Student({
  name : "Baraa",
  score:253,
});
const andalus = new Student({
  name : "Andalus",
  score:150,
});
const yakov = new Student({
  name : "Yakov",
  score:100,
});
Student.insertMany([daniel,yontan,baraa,andalus,yakov],function(err,students){
  if(err){
    console.log(err);
  }
  else{
    console.log(students);
  }
});
