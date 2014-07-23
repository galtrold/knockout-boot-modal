/**
 * Created by Christian James 22-07-2014
 * This code was inspired by Andrew Davey at http://aboutcode.net/2012/11/15/twitter-bootstrap-modals-and-knockoutjs.html
 * 
 * Requirements:
 *  - Knockout
 *  - knockout-amd-helpers
 *  - requirejs
 *  - bootstrap
 *  - jquery
 */

define(["knockout", "jquery"],
    function (ko, $) {

        ko.utils.openModal = function (options) {
            if (typeof options === "undefined") throw new Error("An options argument is required.");
            if (typeof options.viewModel !== "object") throw new Error("options.viewModel is required.");

            var viewModel = options.viewModel;
            var template = options.template || viewModel.template;
            var context = options.context;

            if (!template) throw new Error("options.template or options.viewModel.template is required.");

            return createModalElement(template, viewModel)
                .pipe($) // jQueryify the DOM element
                .pipe(function ($ui) {
                    var deferredModalResult = $.Deferred();
                    showTwitterBootstrapModal($ui);
                    return deferredModalResult;
                });


            // Helper functions

            function createModalElement(templateName, viewModel) {
                var temporaryDiv = addHiddenDivToBody();
                var deferredElement = $.Deferred();
                ko.renderTemplate(
                    templateName,
                    viewModel,
                    // We need to know when the template has been rendered,
                    // so we can get the resulting DOM element.
                    // The resolve function receives the element.
                    {
                        afterRender: function (nodes) {
                            // Ignore any #text nodes before and after the modal element.
                            var elements = nodes.filter(function (node) {
                                return node.nodeType === 1; // Element
                            });
                            deferredElement.resolve(elements[0]);
                        }
                    },
                    // The temporary div will get replaced by the rendered template output.
                    temporaryDiv,
                    "replaceNode"
                );
                // Return the deferred DOM element so callers can wait until it's ready for use.
                return deferredElement;
            };

            function addHiddenDivToBody() {
                var div = document.createElement("div");
                div.style.display = "none";
                document.body.appendChild(div);
                return div;
            };

            function showTwitterBootstrapModal($ui) {

                // Display the modal UI using Twitter Bootstrap's modal plug-in.
                $ui.modal({
                    // Clicking the backdrop, or pressing Escape, shouldn't automatically close the modal by default.
                    // The view model should remain in control of when to close.
                    backdrop: "static",
                    keyboard: false
                });

                $ui.on("hidden.bs.modal", function (e) {
                    ko.cleanNode($ui[0]);
                    $ui.remove();
                });

            };
        };


    });

