import Falcor from 'falcor';
import HttpDataSource from 'falcor-http-datasource';

const dataModel = new Falcor.Model({
    source: new HttpDataSource('./model.json', {
        timeout: 60000
    })
});

export default dataModel;
