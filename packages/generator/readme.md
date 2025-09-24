# Suuudokuuu Generator

Sudoku puzzle generator package

> CS video Stanford Lecture: Don Knuth—"Dancing Links" (2018)www.youtube.com › watch

## References

https://cs.uwaterloo.ca/~a23gao/cs486686_s19/slides/lec06_csp_backtracking_search_nosol

## TODO

- [ ] optimize puzzle generation performance
    - [ ] Remove clues in the center block first as it is more constrained?
    - [ ] Use `Minimum Remaining Values`: pick the blank cell with the fewest legal candidates and try those (shuffled) first
- [ ] add 90%+ code coverage and extensive test cases
