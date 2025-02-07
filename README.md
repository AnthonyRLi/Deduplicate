# Deduplicate

<br>

**Language : Typescript**
<br>
<br>


**Assumptions:**
- Leads are all in the format:
    ```
    _id: string,
    email: string,
    firstName: string,
    lastName: string,
    address: string,
    entryDate: string,
    ```

- Leads with an invalid entryDate (12/41/2025 for example) will be added still as we wouldn't want users to lose data when deduplicating.
<br>

**To Use:**
<br>

1. Assuming you have NPM/Node.js installed, once you have git pulled, run: 
    ```
    npm install

    ```


2. Run the below command to compile from Typescript to Javascript in the dist folder:
    ```
    npm run compile
    ```


3. Save your input json file in the deduplicate/inputOutput folder. There is already a default json file called leads.json in there.


4. Run the below command to deduplicate your json file (default output file is dedupedLeads.json, default log file is updateLog.json):
    ```
    deduplicate remove-duplicates leads.json
    ```

    To change output file name:
    ```
    deduplicate remove-duplicates leads.json -o new-output-file.json
    ```

    To change log file name:
    ```
    deduplicate remove-duplicates leads.json -l new-log-file.json
    ```



<br>
<br>
Thanks!<br>
Anthony
