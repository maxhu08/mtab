## Committing

**Writing a Commit**

After you've followed the coding conventions discussed previously, you can now commit.

If you're solving an issue make sure to list the issue number so that the commit can be linked to the issue.

`Fixed bug (#11)`

**Precommit**

For precommit hooks we use husky, which runs the command `bun prettier` to make sure that everything is formatted properly as specified in the `.prettierrc` file. Make sure you have prettier installed to make sure the precommit hook runs properly.

**Committing**

Now you can commit! After make sure to push to github and submit a new pull request with a description on what your changes do.
