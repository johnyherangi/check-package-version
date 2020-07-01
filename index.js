const core = require('@actions/core');

const npmview = require('npmview');

function parseVersion(version) {
    const [major, minor, patch] = version
        .split(".")
        .map(v => isNaN(v) ? v : new Number(v))
    return {
        major: major || 0,
        minor: minor || 0,
        patch: patch || 0
    }
}

function greaterThan(left, right) {
    left = parseVersion(left)
    right = parseVersion(right)

    if (left.major < right.major) {
        return false
    }

    if (left.minor < right.minor) {
        return false
    }

    return left.patch > right.patch
}

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
        if(greaterThan(version, pkgVersion)) {
            // remote version on npm is newer than current version
            core.setFailed(`Latest package version ${version} is newer than the current package version ${pkgVersion}`);
        }
    });
} catch (error) {
    core.setFailed(error.message);
}
