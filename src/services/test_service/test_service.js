
class FileService {

    getSingleResponse() {
        return Promise.resolve({
            service: 'test',
            type: 'jira',
            issue: {
                summary: 'test summary',
                description: 'test description'
            }
        });
    }

    getArrayResponse() {
        return Promise.resolve([{
            service: 'test',
            type: 'jira',
            issue: {
                summary: 'test summary',
                description: 'test description'
            }
        }, {
            service: 'test2',
            type: 'jira2',
            issue: {
                summary: 'test summary2',
                description: 'test description2'
            }
        }, {
            service: 'test3',
            type: 'jira3',
            issue: {
                summary: 'test summary3',
                description: 'test description3'
            }
        }]);
    }
}

module.exports = new FileService();