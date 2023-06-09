// @flow

import type { Dispatch } from 'redux';

import { createToolbarEvent, sendAnalytics } from '../../analytics';
import { translate } from '../../base/i18n';
import { IconShareDoc } from '../../base/icons';
import { connect } from '../../base/redux';
import { AbstractButton, type AbstractButtonProps } from '../../base/toolbox/components';
import { toggleDocument } from '../../etherpad/actions';
import { setOverflowMenuVisible } from '../../toolbox/actions.web';

type Props = AbstractButtonProps & {

    /**
     * Whether the shared document is being edited or not.
     */
    _editing: boolean,

    /**
     * Redux dispatch function.
     */
    dispatch: Dispatch<any>,
};

/**
 * Implements an {@link AbstractButton} to open the chat screen on mobile.
 */
class SharedDocumentButton extends AbstractButton<Props, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.documentOpen';
    toggledAccessibilityLabel = 'toolbar.accessibilityLabel.documentClose';
    icon = IconShareDoc;
    label = 'toolbar.documentOpen';
    toggledLabel = 'toolbar.documentClose';
    tooltip = 'toolbar.documentOpen';
    toggledTooltip = 'toolbar.documentClose';

    /**
     * Handles clicking / pressing the button, and opens / closes the appropriate dialog.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { _editing, dispatch } = this.props;

        sendAnalytics(createToolbarEvent(
            'toggle.etherpad',
            {
                enable: !_editing
            }));

        dispatch(toggleDocument());
        dispatch(setOverflowMenuVisible(false));
    }

    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._editing;
    }
}

/**
 * Maps part of the redux state to the component's props.
 *
 * @param {Object} state - The redux store/state.
 * @param {Object} ownProps - The properties explicitly passed to the component
 * instance.
 * @returns {Object}
 */
function _mapStateToProps(state: Object, ownProps: Object) {
    const { documentUrl, editing } = state['features/etherpad'];
    const { visible = Boolean(documentUrl) } = ownProps;

    return {
        _editing: editing,
        visible
    };
}

export default translate(connect(_mapStateToProps)(SharedDocumentButton));
