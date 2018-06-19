const {isEmptyObject, validateAndFormatDate} = require('../utils/basic-utils');
const {createEntry, deleteEntry, updateEntry, isThisEntryDeleted} = require('../utils/controller-utils');
const knex = require('../utils/db-connection');

class TestController {
    createTest(req, res){
        if (req.body.visitId && req.body.expectedDate && validateAndFormatDate(req.body.expectedDate)){
            try {
                if (isThisEntryDeleted('VISITS', {'id':req.body.visitId}))
                    res.status(400).send('The selected visit is set as deleted');
                    return ;
            } catch (err) {
                if (err instanceof RangeError) {
                    res.status(400).send('The selected visit was not found');
                    return ;
                }
            }
            let entryObj = {
                'orderedDuringVisit': req.body.visitId,
                'type': req.body.type,
                'expectedOccurDate': validateAndFormatDate(req.body.expectedDate)
            }
            createEntry(req, res, 'ORDERED_TESTS', entryObj, 'databaseError');
        } else {
            res.status(400).send('Please provide the required parameters');
        }
    }

    addActualOccurredDate(req, res){
        if (req.body.testId && req.body.actualOccurredDate && validateAndFormatDate(req.body.actualOccurredDate)){
            knex('ORDERED_TESTS')
                .where({'id':req.body.testId})
                .update({'actualOccurredDate': validateAndFormatDate(req.body.actualOccurredDate)})
                .then(result => {
                    if (result === 1){
                        res.status(200).json(result);
                    } else if (result === 0) {
                        res.status(404).send('cannot find your entry');
                    } else {
                        res.status(500).send('error');
                    }
                })
                .catch(err => {console.log(err);
                    res.status(500).send(err);
                });
        } else {
            res.status(400).send('malformed request.');
        }
    }

    deleteTest(req, res){
        if (req.requester.priv === 1 && req.body.testID){
            deleteEntry(req, res, 'ORDERED_TESTS', {'id': req.body.testID}, 'test', 1);
        }
        else {
            if (req.requester.priv != 1)
                res.status(400).send('You don\'t have the right to do that.');
            else {
                res.status(400).send('Missing information to do that.');
            }
        }
    }
}

const _singleton = new TestController();
module.exports = _singleton;