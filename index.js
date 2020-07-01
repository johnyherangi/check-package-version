const core = require('@actions/core');

const npmview = require('npmview');
const semver = require('npmview');

try {
    const pkgName = require('./package.json').name;
    const pkgVersion = require('./package.json').version;

    // get latest version on npm
    npmview(pkgName, function(error, version, _moduleInfo) {
        if (error) {            
            core.setFailed(error.message);
            return
        }

        if (version === undefined) {
            core.setOutput("No existing package versions found")
        }

        console.log(version)
        console.log(pkgVersion)

        // compare to local version
        if(semver.gt(version, pkgVersion)) {
            // remote version on npm is newer than current version
            core.setFailed(`Latest package version ${version} is newer than the current package version ${pkgVersion}`);
        }
    });
} catch (error) {
    core.setFailed(error.message);
}
