Lab 5
Jacob DeRosa and Jacob Desilets

The controls are described on the page itself and are identical to our lab 3 submission.
For the implementation of our texture, we followed the example in class. We had to
change the vertex and index lists to accommodate for one vertex having multiple texture coordinates.
We did this by duplicating points in our vertex list so that each face has its own unique set of vertices,
then updating the index list accordingly. We used linear filtering for the magnification and 
minification filters.