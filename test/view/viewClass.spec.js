'use strict';
describe('Test for view/viewClass', function() {
    var Klass = namespace.view.ViewClass;
    describe('#my_class_method', function() {
        it('it return lower case constant', function() {
            var res = Klass.my_class_method();
            expect(res).to.be('constant');
        });
    });
    it('true', function() {
        expect(true).to.ok();
    });
});