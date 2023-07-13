# cat-scan

### Install

`npm install -g cat-scan`

### Use

Have you ever had to run through and figure out a code base for a new project or a new job? Or even worse a legacy project.

cat-scan helps make notes and tagged groups of notes for dissecting code bases to provide clarity. It can be used to dig out bugs by tracing their origin files with human readable notes that are grouped by tag and stuff like that.

To make a cat-scan note in your code base, add a comment line, in whatever language, with the word "CATSCAN" in the comment. Optionally, the next word will be the tag for the note. Notes are grouped by tag in the cat-scan output. There is a special default group of 'general' for cat-scan notes without a designated tag. Anything after the tag will be the text for the cat-scan note.

There are options as well for helping skip files like images and files like package-lock.json which are too big and not ascii. The default maxSize is 50k. You shouldn't have code files larger than that, but I'm not your dad. So, the maxSize adjustable.

Some cat-scan notes may be as follows:

- `// CATSCAN JIRA-1342 This is around where the bug is`
- `// CATSCAN JIRA-1342 The bug could be here too`
- `// CATSCAN DEBUG Something is broke here, thanks Greg`

Run `cat-scan` in any directory and check it out. Tell your friends, but don't stay up too late. Tomorrow is another day.

### Examples

Has no notes without tags + has 1 note with tag "debug"

<pre>
$ node index.js -s
    Cat Scanning "." ...
      debug:
        [ utils/printUtils.js:56 ] Something is broke here
    ...Done
</pre>

Has 1 notes without a tag + has 1 note with tag "debug" + maxSize of 75k + show skipped

<pre>
$ node index.js -s -m 75
    Cat Scanning "." ...
      general:
        [ index.js.js:23 ]
      >75k-too-big-skipped:
        [ package-lock.json 121.8k ]
      debug:
        [ utils/printUtils.js:56 ] Something is broke here
    ...Done
</pre>

Has 2 notes with tags exploring a specific ticket number "JIRA-1342"

<pre>
$ node index.js -s
    Cat Scanning "." ...
      >75k-too-big-skipped:
        [ package-lock.json 121.8k ]
      jira-1342:
        [ index.js:104 ] This is around where the bug is
        [ utils/printUtils.js:40 ] The bug could be here too
    ...Done
</pre>

### CLI Options

- --dir - allows you to select a starting directory to scan. It will scan this directory recursively. (defaults to ".")
- --maxSize - allows you to control the size, in k, of the files to skip during your cat-scan. This is important because the scanning is faster when large files like images and package.locks are not included. So, cat-scan defaults to skipping files larger than 50k. It's meant to focus on your code files. Hopefully you don't have any larger than 50k. But if you do, you can adjust the maxSize to skip the right files for your project. (defaults to 50)
- --skipped - Will include a special tag section in the output that listing the skipped files and their file sizes relative to the selected maxSize (defaults to false)
- --all - will add the file sizes to all the files listed in the output. This will help you figure out why some of your files are being skipped or what your file sizes are to set the maxSize option appropriately for the output you want. (defaults to false)

| Option                | Effect                                                     | Default |
| :-------------------- | :--------------------------------------------------------- | :-----: |
| -d, --dir <char\>     | Dir to cat scan                                            |   "."   |
| -m, --maxSize <char\> | Sets the max file size ot scan                             |   50    |
| -s, --skipped         | Includes a section in the output listing the skipped files |  false  |
| -a, --all             | Include file size in all outputs                           |  false  |
| -v, --version         | Shows cat-scan version number                              |         |
| -h, --help            | Shows an options list                                      |         |

### Config file

You can add a config file named `.cat-scan-config.json` into your home dir and define a couple of useful things.

| Key     | Effect                                                                                      |
| :------ | :------------------------------------------------------------------------------------------ |
| skip    | An array of string file/dir names to be skipped by cat-scan                                 |
| maxSize | A new global default maxSize. Command line --maxSize will override the value in this config |

<pre>
{
	"skip": [
		".solid",
        ".next",
        "python-output",
        "some-db-dir"
    ],
	"maxSize": 73
}
</pre>

### The Code

Don't read the code. It was written in one night and it sucks alright.
